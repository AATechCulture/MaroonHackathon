import json

def transform_curriculum_data(input_data):
    """
    Transform curriculum JSON data into a simplified format with classifications.
    """
    output = {
        "school_name": input_data["school_name"],
        "majors": []
    }
    
    # Classifications we want to preserve
    classifications = ["freshman", "sophomore", "junior", "senior"]
    
    # Process each college
    for college in input_data["colleges"]:
        # Process each major in the college
        for major in college.get("majors", []):
            curriculum = major.get("curriculum", {})
            
            # Skip if curriculum is empty
            if not curriculum:
                continue
            
            # Check if any semester has courses
            has_courses = False
            for year in curriculum.values():
                for semester in year.values():
                    if semester:
                        has_courses = True
                        break
                if has_courses:
                    break
            
            if not has_courses:
                continue
            
            # Initialize the transformed major
            transformed_major = {
                "name": major["major_name"],
                "curriculum": {}
            }
            
            # Process each classification
            for classification in classifications:
                if classification in curriculum:
                    year_data = curriculum[classification]
                    
                    # Only add classification if it has courses
                    if year_data["fall"] or year_data["spring"]:
                        transformed_major["curriculum"][classification] = {
                            "fall": [f"{course['code']} {course['name']}" 
                                   for course in year_data.get("fall", [])],
                            "spring": [f"{course['code']} {course['name']}" 
                                     for course in year_data.get("spring", [])]
                        }
            
            # Only add major if it has any courses
            if transformed_major["curriculum"]:
                output["majors"].append(transformed_major)
    
    return output

def process_file(input_file_path, output_file_path):
    """
    Process the input JSON file and write the transformed data to the output file.
    """
    # Read input JSON
    with open(input_file_path, 'r') as file:
        input_data = json.load(file)
    
    # Transform the data
    transformed_data = transform_curriculum_data(input_data)
    
    # Write output JSON
    with open(output_file_path, 'w') as file:
        json.dump(transformed_data, file, indent=2)

# Example usage
if __name__ == "__main__":
    input_file = "bethune-cookman_university.json"
    output_file = "bethune-cookman_university_transformed.json"
    process_file(input_file, output_file)