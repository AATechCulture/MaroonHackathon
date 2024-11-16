// components/Onboarding.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Onboarding = () => {
  const [interests, setInterests] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!interests.trim() || !careerGoal.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Add API call here to save data
      // await axios.post('/api/onboarding', { interests, careerGoal });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error saving your information",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold mb-6">Tell us about your interests</h2>
      <Textarea 
        placeholder="What are you interested in? e.g., building apps, solving problems"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        className="min-h-[100px]"
      />
      <Input 
        type="text" 
        placeholder="Your career goal, e.g., Software Engineer" 
        value={careerGoal}
        onChange={(e) => setCareerGoal(e.target.value)}
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
      </Button>
    </div>
  );
};

export default Onboarding;