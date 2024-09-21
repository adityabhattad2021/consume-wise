"use client"
import React, { useState, memo } from 'react'
import { ChevronRight, ChevronLeft, Check, Carrot, Leaf, Scale, Heart, Sparkles, LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Field {
  name: string
  key: string
  type: 'text' | 'number' | 'select' | 'multiselect'
  options?: string[]
}

interface Step {
  name: string
  description: string
  fields: Field[]
  icon: React.ReactNode
  feature: string
}

const steps: Step[] = [
  {
    name: 'Your Profile',
    description: 'Help us personalize your experience.',
    fields: [
      { name: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      { name: 'Age', key: 'age', type: 'number' },
      { name: 'Weight (kg)', key: 'weight', type: 'number' },
      { name: 'Height (cm)', key: 'height', type: 'number' }
    ],
    icon: <Scale className="w-8 h-8 text-blue-500" />,
    feature: "Tailored nutrition advice for your body type and goals!"
  },
  {
    name: 'Health Considerations',
    description: 'Let us know about any specific health conditions.',
    fields: [
      { name: 'Health Details', key: 'healthDetails', type: 'multiselect', options: ['No specific conditions', 'Diabetes', 'High blood pressure', 'Heart disease', 'Food allergies', 'Gluten intolerance'] }
    ],
    icon: <Heart className="w-8 h-8 text-red-500" />,
    feature: "Smart alerts for ingredients you should avoid!"
  },
  {
    name: 'Lifestyle Choices',
    description: 'Tell us about your activity and dietary preferences.',
    fields: [
      { name: 'Regular Activity Level', key: 'activityLevel', type: 'select', options: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'] },
      { name: 'Dietary Preference', key: 'dietaryPreference', type: 'select', options: ['No Preference', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'] }
    ],
    icon: <Carrot className="w-8 h-8 text-orange-500" />,
    feature: "Discover new foods that match your lifestyle!"
  },
  {
    name: 'Your Health Goals',
    description: 'What do you want to achieve with ConsumeWise?',
    fields: [
      { name: 'Nutrition Knowledge', key: 'nutritionKnowledge', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
      { name: 'Health Goal', key: 'healthGoal', type: 'select', options: ['Make healthier choices', 'Manage weight', 'Reduce sugar intake', 'Heart health', 'Understand food labels better'] }
    ],
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    feature: "Track your progress and celebrate your health victories!"
  },
]

interface HeaderProps {
  step: number
  totalSteps: number
}

const Header = memo(function Header({ step, totalSteps }: HeaderProps) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-4 bg-green-100 rounded-lg shadow-inner"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-green-600 font-semibold">Step {step + 1} of {totalSteps}</span>
      </div>
      <p className="text-gray-700">{steps[step].feature}</p>
      {step < totalSteps - 1 && (
        <p className="text-sm text-green-600 mt-2">Just {totalSteps - step - 1} more step{totalSteps - step - 1 > 1 ? 's' : ''} to go!</p>
      )}
      {step === totalSteps - 1 && (
        <p className="text-sm text-green-600 mt-2">You're at the finish line! One last step to a healthier you!</p>
      )}
    </motion.div>
  )
})

interface FormData {
  username: string
  basicInfo: {
    gender: string
    age: string
    weight: string
    height: string
  }
  healthDetails: string[]
  lifestyle: {
    activityLevel: string
    dietaryPreference: string
  }
  goals: {
    nutritionKnowledge: string
    healthGoal: string
  }
}

export default function OnboardingForm() {
  const [step, setStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    basicInfo: { gender: '', age: '', weight: '', height: '' },
    healthDetails: [],
    lifestyle: { activityLevel: '', dietaryPreference: '' },
    goals: { nutritionKnowledge: '', healthGoal: '' },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: keyof FormData) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      const updatedHealthDetails = target.checked
        ? [...formData.healthDetails, value]
        : formData.healthDetails.filter(item => item !== value)
      setFormData(prev => ({ ...prev, healthDetails: updatedHealthDetails }))
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section] as Record<string, string>, [name]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsComplete(true)
    triggerConfetti()
  }

  const triggerConfetti = () => {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min:number, max:number) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  return (
    <div className="w-full max-w-md min-w-0 sm:min-w-[800px] mx-auto mt-4 p-4 bg-white rounded-2xl md:shadow-xl border-solid morder-0 md:border-2">
      <h2 className="text-xl font-bold mb-4 text-center text-green-600">Welcome to ConsumeWise</h2>
      <Header step={step} totalSteps={steps.length} />
      {!isComplete ? (
        <form onSubmit={handleSubmit}>
          <div
            className="mb-6 min-h-[300px] w-full"
          >
            <div className="flex items-center mb-4">
              {steps[step].icon}
              <h3 className="text-xl font-semibold ml-3">{steps[step].name}</h3>
            </div>
            <p className="text-gray-600 mb-6">{steps[step].description}</p>
            {
              step === 0 && (
                <>
                  {/* Gender */}
                  <div className='flex flex-col sm:flex-row gap-3 mb-3'>
                    <div className='flex-1'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.basicInfo.gender}
                        onChange={(e) => handleInputChange(e, 'basicInfo')}
                        className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Gender</option>
                        {steps[0].fields[0].options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Age */}
                    <div className='flex-1'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                      <Input
                        type="number"
                        name="age"
                        value={formData.basicInfo.age}
                        onChange={(e) => handleInputChange(e, 'basicInfo')}
                        className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>


                  {/* Weight */}
                  <div className='flex flex-col sm:flex-row gap-3 mb-3'>
                    <div className='flex-1'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Weight (Kg)</label>
                      <Input
                        type="number"
                        name="weight"
                        value={formData.basicInfo.weight}
                        onChange={(e) => handleInputChange(e, 'basicInfo')}
                        className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {/* Height */}
                    <div className='flex-1'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Height (cm)</label>
                      <Input
                        type="number"
                        name="height"
                        value={formData.basicInfo.height}
                        onChange={(e) => handleInputChange(e, 'basicInfo')}
                        className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </>
              )
            }
            {
              step === 1 && (
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Health Details</label>
                  <div className="space-y-2">
                    {steps[1].fields[0].options?.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="healthDetails"
                          value={option}
                          checked={formData.healthDetails.includes(option)}
                          onChange={(e) => handleInputChange(e)}
                          className="form-checkbox h-5 w-5 text-green-600 rounded transition duration-150 ease-in-out"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            }

            {
              step === 2 && (
                <>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Regular Activity Level</label>
                    <select
                      name="activityLevel"
                      value={formData.lifestyle.activityLevel}
                      onChange={(e) => handleInputChange(e, 'lifestyle')}
                      className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Activity Level</option>
                      {steps[2].fields[0].options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Dietary Preference</label>
                    <select
                      name="dietaryPreference"
                      value={formData.lifestyle.dietaryPreference}
                      onChange={(e) => handleInputChange(e, 'lifestyle')}
                      className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Dietary Preference</option>
                      {steps[2].fields[1].options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )
            }

            {step === 3 && (
              <>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nutrition Knowledge</label>
                  <select
                    name="nutritionKnowledge"
                    value={formData.goals.nutritionKnowledge}
                    onChange={(e) => handleInputChange(e, 'goals')}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Nutrition Knowledge Level</option>
                    {steps[3].fields[0].options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Health Goal</label>
                  <select
                    name="healthGoal"
                    value={formData.goals.healthGoal}
                    onChange={(e) => handleInputChange(e, 'goals')}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Health Goal</option>
                    {steps[3].fields[1].options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>


          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={step === 0}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 transition-all duration-300"
            >
              <ChevronLeft className="inline-block mr-1" size={18} />
              Back
            </Button>
            {step === steps.length - 1 ? (
              <Button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg transition-all duration-300"
              >
                Start Your Journey
                <Check className="inline-block ml-1" size={18} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-green-500 text-white rounded-lg transition-all duration-300"
              >
                Continue
                <ChevronRight className="inline-block ml-1" size={18} />
              </Button>
            )}
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center min-h-[300px] sm:min-h-[400px] flex flex-col justify-center"
        >
          <p className="text-sm sm:text-md text-gray-700 mb-6">Your personalized journey to healthier food choices begins now.</p>
          <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-green-600">
            Click <Button className='text-lg mx-[-12px]' variant={"link"}>here</Button> to get started.
          </p>
        </motion.div>
      )}
    </div>
  )
}