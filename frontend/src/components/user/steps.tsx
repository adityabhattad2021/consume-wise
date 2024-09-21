import { Carrot, Heart, Leaf, Scale } from "lucide-react"
import { Gender, HealthDetail, ActivityLevel, DietaryPreference, HealthGoal } from '@/form_schema/user'

interface Field {
    name: string
    key: string
    type: 'text' | 'number' | 'select' | 'multiselect'
    // eslint-disable-next-line 
    options?: any[]
  }
  
  interface Step {
    name: string
    description: string
    fields: Field[]
    icon: React.ReactNode
    feature: string
  }
  
  export const steps: Step[] = [
    {
      name: 'Your Profile',
      description: 'Help us personalize your experience.',
      fields: [
        { name: 'Gender', key: 'gender', type: 'select', options: Object.values(Gender.enum) },
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
        { name: 'Health Details', key: 'healthDetails', type: 'multiselect', options: Object.values(HealthDetail.enum) }
      ],
      icon: <Heart className="w-8 h-8 text-red-500" />,
      feature: "Smart alerts for ingredients you should avoid!"
    },
    {
      name: 'Lifestyle Choices',
      description: 'Tell us about your activity and dietary preferences.',
      fields: [
        { name: 'Regular Activity Level', key: 'activityLevel', type: 'select', options: Object.values(ActivityLevel.enum) },
        { name: 'Dietary Preference', key: 'dietaryPreference', type: 'select', options: Object.values(DietaryPreference.enum) }
      ],
      icon: <Carrot className="w-8 h-8 text-orange-500" />,
      feature: "Discover new foods that match your lifestyle!"
    },
    {
      name: 'Your Health Goals',
      description: 'What do you want to achieve with ConsumeWise?',
      fields: [
        { name: 'Nutrition Knowledge', key: 'nutritionKnowledge', type: 'select', options: [1, 2, 3] },
        { name: 'Health Goal', key: 'healthGoal', type: 'select', options: Object.values(HealthGoal.enum) }
      ],
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      feature: "Track your progress and celebrate your health victories!"
    },
  ]
  