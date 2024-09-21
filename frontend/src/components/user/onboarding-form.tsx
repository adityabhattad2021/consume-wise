"use client"
import React, { useState, memo } from 'react'
import { ChevronRight, ChevronLeft, Check, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { userFormSchema } from '@/form_schema/user'
import { triggerConfetti } from "@/lib/confetti";
import { steps } from './steps'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { capitalizeWords } from '@/lib/capitalize_word'
import axios from 'axios';
import Link from 'next/link'

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
        <p className="text-sm text-green-600 mt-2">You&apos;re at the finish line! One last step to a healthier you!</p>
      )}
    </motion.div>
  )
})

export default function OnboardingForm() {
  const [step, setStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      gender: undefined,
      age: undefined,
      weight: undefined,
      height: undefined,
      healthDetails: [],
      activityLevel: undefined,
      dietaryPreference: undefined,
      nutritionKnowledge: undefined,
      healthGoals: [],
    },
  })

  const handleNext = async () => {
    const currentStep = steps[step]
    // @ts-expect-error don't know the type
    const isValid = await form.trigger(currentStep.fields.map(val => val.key))
    if (isValid && step < steps.length - 1) {
      setStep(prev => prev + 1)
    }
  }

  const handlePrevious = async () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
  }

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    try{
      await axios.post('/api/onboard', values)
    }catch(err){
      console.log('login unsuccessful.');
    }
    setIsComplete(true)
    triggerConfetti()
  }


  return (
    <div className="w-full max-w-md min-w-0 sm:min-w-[800px] mx-auto mt-4 p-4 bg-white rounded-2xl md:shadow-xl border-solid morder-0 md:border-2">
      <h2 className="text-xl font-bold mb-4 text-center text-green-600">Welcome to ConsumeWise</h2>
      <Header step={step} totalSteps={steps.length} />
      {!isComplete ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => {
                          return (
                            <FormItem className='flex-1'>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                              <Select
                                name="gender"
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <SelectValue placeholder="Select Gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {steps[0].fields[0].options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {capitalizeWords(option)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />

                      {/* Age */}
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => {
                          return (
                            <FormItem className='flex-1'>
                              <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Age</FormLabel>
                              <FormControl>
                                <Input

                                  placeholder='Enter your age here'
                                  className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                    </div>


                    {/* Weight */}
                    <div className='flex flex-col sm:flex-row gap-3 mb-3'>
                      <FormField
                        control={form.control}
                        name='weight'
                        render={({ field }) => {
                          return (
                            <FormItem className='flex-1'>
                              <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Weight (Kg)</FormLabel>
                              <FormControl>
                                <Input

                                  placeholder='Enter your weight'
                                  {...field}
                                  value={field.value || ''}
                                  className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name='height'
                        render={({ field }) => {
                          return (
                            <FormItem className='flex-1'>
                              <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Height (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter your height here'
                                  className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </>
                )
              }
              {
                step === 1 && (
                  <FormField
                    control={form.control}
                    name='healthDetails'
                    render={({ field }) => {

                      return (
                        <FormItem className='mb-3'>
                          <FormLabel className="block text-xs font-medium text-gray-700 mb-4">
                            Health Details
                          </FormLabel>
                          <div className='grid grid-cols-2 md:grid-cols-3 text-sm gap-2 md:gap-4'>
                            {steps[1].fields[0].options?.map((item) => {
                              return (
                                <div className='flex mb-2 justify-start items-center gap-2' key={item}>
                                  <FormControl>
                                    <Checkbox
                                      id={item}
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <label htmlFor={item} className="font-normal">
                                    {capitalizeWords(item)}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                )
              }

              {
                step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem className='mb-3'>
                          <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Regular Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <SelectValue placeholder="Select Activity Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {steps[2].fields[0].options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {capitalizeWords(option)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dietaryPreference"
                      render={({ field }) => (
                        <FormItem className='mb-3'>
                          <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Dietary Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <SelectValue placeholder="Select Dietary Preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {steps[2].fields[1].options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {capitalizeWords(option)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )
              }

              {step === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="nutritionKnowledge"
                    render={({ field }) => {

                      return (
                        <FormItem className='mb-3'>
                          <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Nutrition Knowledge</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ''}>
                            <FormControl>
                              <SelectTrigger className="w-full p-3 py-6 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <SelectValue placeholder="Select Nutrition Knowledge Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {steps[3].fields[0].options?.map((option) => (
                                <SelectItem key={option} value={option.toString() || ''}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="healthGoals"
                    render={({ field }) => (
                      <FormItem className='mb-3'>
                        <FormLabel className="block text-xs font-medium text-gray-700 mb-1">Health Goal</FormLabel>
                        <FormControl>
                          <div className='grid grid-cols-2 md:grid-cols-3 text-sm gap-2 md:gap-4'>
                            {steps[3].fields[1].options?.map((item) => {
                              return (
                                <div className='flex mb-2 justify-start items-center gap-2' key={item}>
                                  <Checkbox
                                    
                                    checked={field.value?.includes(item)}
                                    id={item}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        )
                                    }}
                                  />
                                  <label htmlFor={item} className="font-normal text-wrap">
                                    {capitalizeWords(item)}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              {step === steps.length - 1 && (
                <Button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg transition-all duration-300"
                >
                  Start Your Journey
                  <Check className="inline-block ml-1" size={18} />
                </Button>
              )
              }

              {step < steps.length - 1 && (
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
        </Form>

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
            Click <Button variant={"link"} asChild>
              <Link href={"/"} className='text-lg mx-[-12px]'>
                here
              </Link>
            </Button> to get started.
          </p>
        </motion.div>
      )}
    </div>
  )
}