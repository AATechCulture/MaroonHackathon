import requests
from bs4 import BeautifulSoup
import json
import os
from openai import OpenAI
from urllib.parse import urljoin, urlparse
import time
import re
from collections import defaultdict
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class CurriculumParser:
    def __init__(self):

         # Get OpenAI API key from environment variables
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = OpenAI(api_key=openai_api_key)
        self.base_url = None
        # Track processed URLs to avoid duplicates
        self.processed_urls = set()
        # Track processed colleges and majors by name to avoid duplicates
        self.processed_colleges = set()
        self.processed_majors = defaultdict(set)  # {college_name: set(major_names)}
        # Track circular references
        self.current_path = []
        
    def is_valid_url(self, url):
        """Check if URL is valid and belongs to the same domain"""
        try:
            base_domain = urlparse(self.base_url).netloc
            url_domain = urlparse(url).netloc
            return base_domain == url_domain
        except:
            return False
            
    def is_circular_reference(self, url):
        """Check if URL is in current processing path"""
        return url in self.current_path
        
    def get_page_content(self, url):
        """Fetch content from a given URL"""
        if not self.is_valid_url(url):
            print(f"Skipping invalid or external URL: {url}")
            return None
            
        if url in self.processed_urls:
            print(f"Skipping already processed URL: {url}")
            return None
            
        if self.is_circular_reference(url):
            print(f"Detected circular reference, skipping: {url}")
            return None
            
        try:
            self.current_path.append(url)
            response = requests.get(url)
            response.raise_for_status()
            self.processed_urls.add(url)
            return response.text
        except Exception as e:
            print(f"Error fetching URL {url}: {str(e)}")
            return None
        finally:
            self.current_path.pop()

    def extract_college_links(self, html_content):
        """Extract links to all colleges from the main page"""
        soup = BeautifulSoup(html_content, 'html.parser')
        college_links = []
        
        # Look for college links in the sidebar or main content
        potential_colleges = soup.find_all('a')
        
        for link in potential_colleges:
            text = link.get_text().strip()
            href = link.get('href')
            
            # Skip if we've already processed this college
            if text in self.processed_colleges:
                continue
                
            if href and any(college_keyword in text.lower() for college_keyword in 
                          ['college of', 'school of']):
                full_url = urljoin(self.base_url, href)
                if self.is_valid_url(full_url):
                    college_links.append({
                        'name': text,
                        'url': full_url
                    })
                    self.processed_colleges.add(text)
        
        return college_links

    def extract_major_links(self, college_page_content, college_url, college_name):
        """Extract links to all majors within a college"""
        soup = BeautifulSoup(college_page_content, 'html.parser')
        major_links = []
        
        # Look for program/major links
        for link in soup.find_all('a'):
            href = link.get('href')
            text = link.get_text().strip()
            
            # Skip if we've already processed this major for this college
            if text in self.processed_majors[college_name]:
                continue
                
            # Check if link contains keywords suggesting it's a major
            if href and any(keyword in text.lower() for keyword in 
                          ['b.s.', 'b.a.', 'major', 'program', 'degree']):
                if not any(keyword in text.lower() for keyword in 
                          ['minor', 'certificate']):  # Exclude minors and certificates
                    full_url = urljoin(college_url, href)
                    if self.is_valid_url(full_url):
                        major_links.append({
                            'name': text,
                            'url': full_url
                        })
                        self.processed_majors[college_name].add(text)
        
        return major_links

    def parse_curriculum_page(self, html_content):
        """Parse individual curriculum page content"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove navigation elements, headers, footers, etc.
        for element in soup.select('nav, header, footer, script, style'):
            element.decompose()
            
        # Extract course tables or lists
        course_content = []
        
        # Look for tables containing course information
        tables = soup.find_all('table')
        for table in tables:
            course_content.append(table.get_text(separator=' ', strip=True))
            
        # Look for lists containing course information
        lists = soup.find_all(['ul', 'ol'])
        for list_elem in lists:
            if any(course_indicator in list_elem.get_text().lower() 
                  for course_indicator in ['credit', 'course', 'semester']):
                course_content.append(list_elem.get_text(separator=' ', strip=True))
                
        # Look for specific course sections
        course_sections = soup.find_all(class_=lambda x: x and any(
            term in (x.lower() if x else '') 
            for term in ['course', 'curriculum', 'semester', 'year']))
        for section in course_sections:
            course_content.append(section.get_text(separator=' ', strip=True))
        
        # Get any remaining text that might contain course information
        main_content = soup.get_text(separator='\n')
        
        # Combine all content
        all_content = '\n'.join(course_content + [main_content])
        
        # Clean up the text
        lines = [line.strip() for line in all_content.split('\n') if line.strip()]
        cleaned_content = '\n'.join(lines)
        
        # Extract prerequisites information
        prereq_pattern = r'prerequisite.*?:|pre-req.*?:|pre:.*?'
        prerequisites = re.findall(prereq_pattern, cleaned_content, re.IGNORECASE)
        
        return {
            'main_content': cleaned_content,
            'prerequisites': prerequisites
        }
    def parse_with_ai(self, curriculum_data, college_name, major_name):
        """Use OpenAI to parse the curriculum text into structured data"""
        prompt = f"""
        Parse the following curriculum text for {college_name}, {major_name} into this JSON structure:
        {{
            "college_name": "{college_name}",
            "major_name": "{major_name}",
            "degree_type": "",
            "department": "",
            "curriculum": {{
                "freshman": {{
                    "fall": [
                        {{
                            "code": "course_code",
                            "name": "course_name",
                            "credits": "credit_hours",
                        }}
                    ],
                    "spring": []
                }},
                "sophomore": {{
                    "fall": [],
                    "spring": []
                }},
                "junior": {{
                    "fall": [],
                    "spring": []
                }},
                "senior": {{
                    "fall": [],
                    "spring": []
                }}
            }},
        }}

        Rules for parsing:
        1. Course codes should be in the format "ABC 123" (letters space numbers)
        2. Credit hours should be numbers only


        Text content to parse:
        {curriculum_data.get('main_content', '')}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a curriculum parsing assistant specializing in university academic programs."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in AI parsing: {str(e)}")
            return None

    def process_school(self, base_url):
        """Process entire school curriculum data"""
        self.base_url = base_url
        school_data = {
            "school_name": "Bethune-Cookman University",
            "colleges": [],
            "processing_stats": {
                "total_pages_processed": 0,
                "skipped_duplicates": 0,
                "skipped_circular_refs": 0,
                "failed_pages": 0
            }
        }
        
        # Get main page content
        main_content = self.get_page_content(base_url)
        if not main_content:
            return None
            
        # Get all college links
        college_links = self.extract_college_links(main_content)
        
        # Process each college
        for college in college_links:
            print(f"\nProcessing college: {college['name']}")
            college_data = {
                "name": college['name'],
                "majors": []
            }
            
            # Get college page content
            college_content = self.get_page_content(college['url'])
            if college_content:
                # Get all major links for this college
                major_links = self.extract_major_links(college_content, college['url'], college['name'])
                
                # Process each major
                for major in major_links:
                    print(f"Processing major: {major['name']}")
                    major_content = self.get_page_content(major['url'])
                    if major_content:
                        parsed_content = self.parse_curriculum_page(major_content)
                        major_data = self.parse_with_ai(
                            parsed_content,
                            college['name'],
                            major['name']
                        )
                        if major_data:
                            college_data["majors"].append(major_data)
                            school_data["processing_stats"]["total_pages_processed"] += 1
                        else:
                            school_data["processing_stats"]["failed_pages"] += 1
                    time.sleep(1)  # Be nice to the server
                    
            school_data["colleges"].append(college_data)
            time.sleep(1)  # Be nice to the server
            
        # Update final statistics
        school_data["processing_stats"].update({
            "skipped_duplicates": len(self.processed_urls) - school_data["processing_stats"]["total_pages_processed"],
            "skipped_circular_refs": len([url for url in self.processed_urls if self.is_circular_reference(url)])
        })
        
        return school_data

    def save_json(self, data, school_name):
        """Save the parsed data to a JSON file"""
        filename = f"{school_name.lower().replace(' ', '_')}.json"
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"\nSuccessfully saved data to {filename}")
            print("\nProcessing Statistics:")
            print(f"Total Pages Processed: {data['processing_stats']['total_pages_processed']}")
            print(f"Skipped Duplicates: {data['processing_stats']['skipped_duplicates']}")
            print(f"Skipped Circular References: {data['processing_stats']['skipped_circular_refs']}")
            print(f"Failed Pages: {data['processing_stats']['failed_pages']}")
        except Exception as e:
            print(f"Error saving JSON file: {str(e)}")
def main():
    # Get user input
    school_name = input("Enter the school name: ")
    base_url = input("Enter the main academic catalog URL: ")

    # Initialize parser
    parser = CurriculumParser()
    
    # Process the entire school
    print("\nStarting curriculum data collection...")
    school_data = parser.process_school(base_url)
    
    if school_data:
        print("\nSaving results...")
        parser.save_json(school_data, school_name)
        print("Process completed successfully!")
    else:
        print("Error: Failed to process school data")

if __name__ == "__main__":
    main()