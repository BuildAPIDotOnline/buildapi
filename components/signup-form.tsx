'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { api, ApiClientError } from '@/lib/api-client'
import { setToken } from '@/lib/auth-storage'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  country: z.string().min(1, 'Please select your country'),
  companyName: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(1, 'Please select industry'),
  heardAboutUs: z.string().min(1, 'Please tell us how you heard about us'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
]

const industries = [
  'CMS & Content Management',
  'Banking & Finance',
  'Ecommerce',
  'SaaS & Enterprise',
  'Healthcare',
  'EdTech',
  'Other',
]

const heardAboutUsSources = [
  'Search Engine',
  'Social Media',
  'Developer Community',
  'Direct Referral',
  'Conference/Event',
  'Friend or Colleague',
  'Other',
]

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'Belgium',
  'Switzerland',
  'Austria',
  'Poland',
  'Portugal',
  'Greece',
  'India',
  'China',
  'Japan',
  'South Korea',
  'Singapore',
  'Hong Kong',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Egypt',
  'UAE',
  'Saudi Arabia',
  'Israel',
  'Turkey',
  'Russia',
  'Other',
]

export default function SignupForm({ setStep }: { setStep: (step: number) => void }) {
  const [step, setInternalStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      country: '',
      companyName: '',
      jobTitle: '',
      companySize: '',
      industry: '',
      heardAboutUs: '',
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      // Remove confirmPassword and acceptTerms before sending to API
      const { confirmPassword, acceptTerms, ...signupData } = data
      
      const response = await api.post<{ success: boolean; token: string; user: any }>(
        '/api/auth/signup',
        signupData
      )

      if (response.success && response.token) {
        setToken(response.token)
        toast({
          title: 'Account created successfully',
          description: 'Welcome to BuildAPI!',
        })
        setInternalStep(3)
        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      const errorMessage =
        error instanceof ApiClientError
          ? error.message
          : 'Failed to create account. Please try again.'
      
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'country'])
      if (isValid) {
        setInternalStep(2)
      }
    }
  }

  const handleBackStep = () => {
    setInternalStep(step - 1)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Step 1: Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Let's start with your personal details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll send a confirmation link to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Minimum 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="••••••••"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Re-enter password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Continue to Company Info
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Company & Source Information */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Step 2: Company Information</h2>
              <p className="text-sm text-muted-foreground">
                Tell us about your organization
              </p>
            </div>

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
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
              name="heardAboutUs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did you hear about us?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {heardAboutUsSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={handleBackStep}
                variant="outline"
                className="flex-1 bg-transparent"
                size="lg"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300 text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome to BuildAPI!</h2>
              <p className="text-muted-foreground mb-2">
                Your account has been created successfully.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a confirmation email to <span className="font-medium text-foreground">{form.watch('email')}</span>
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 text-left mb-6">
              <h3 className="font-semibold mb-4">What's next?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1</span>
                  <span>Verify your email address</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2</span>
                  <span>Complete your profile setup</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3</span>
                  <span>Get your API keys and start building</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                size="lg"
              >
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}
