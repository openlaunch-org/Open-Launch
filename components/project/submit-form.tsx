/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useCallback, useEffect, useId, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { platformType, pricingType } from "@/drizzle/db/schema"
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiCloseCircleLine,
  RiFileCheckLine,
  RiImageAddLine,
  RiInformation2Line,
  RiInformationLine,
  RiListCheck,
  RiLoader4Line,
  RiRocketLine,
  RiStarLine,
  RiVipCrownLine,
} from "@remixicon/react"
import { addDays, format, parseISO } from "date-fns"
import { Tag, TagInput } from "emblor"

import {
  DATE_FORMAT,
  LAUNCH_LIMITS,
  LAUNCH_SETTINGS,
  LAUNCH_TYPES,
  PREMIUM_PAYMENT_LINK,
  PREMIUM_PLUS_PAYMENT_LINK,
} from "@/lib/constants"
import { UploadButton } from "@/lib/uploadthing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { notifyDiscordLaunch } from "@/app/actions/discord"
import {
  checkUserLaunchLimit,
  getLaunchAvailabilityRange,
  scheduleLaunch,
} from "@/app/actions/launch"
import type { LaunchAvailability } from "@/app/actions/launch"
import { getAllCategories, submitProject } from "@/app/actions/projects"

interface ProjectFormData {
  name: string
  websiteUrl: string
  description: string
  categories: string[]
  techStack: string[]
  platforms: string[]
  pricing: string
  githubUrl?: string
  twitterUrl?: string
  scheduledDate: string | null
  launchType: (typeof LAUNCH_TYPES)[keyof typeof LAUNCH_TYPES]
}

interface DateGroup {
  key: string
  displayName: string
  dates: LaunchAvailability[]
}

interface SubmitProjectFormProps {
  userId: string
}

export function SubmitProjectForm({ userId }: SubmitProjectFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    websiteUrl: "",
    description: "",
    categories: [],
    techStack: [],
    platforms: [],
    pricing: "",
    githubUrl: "",
    twitterUrl: "",
    scheduledDate: null,
    launchType: LAUNCH_TYPES.FREE,
  })

  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null)
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState<string | null>(null)

  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [availableDates, setAvailableDates] = useState<LaunchAvailability[]>([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const [isLaunchDateOverLimit, setIsLaunchDateOverLimit] = useState(false)
  const [launchDateLimitError, setLaunchDateLimitError] = useState<string | null>(null)
  const [isLoadingDateCheck, setIsLoadingDateCheck] = useState(false)

  const tagInputId = useId()

  const [techStackTags, setTechStackTags] = useState<Tag[]>([])
  const [activeTechTagIndex, setActiveTechTagIndex] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const checkWebsiteUrl = async (url: string) => {
    try {
      const response = await fetch(`/api/projects/check-url?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error("Error checking website URL:", error)
      return false
    }
  }

  const loadAvailableDates = useCallback(async () => {
    setIsLoadingDates(true)
    try {
      let startDate, endDate
      const today = new Date()

      if (formData.launchType === LAUNCH_TYPES.PREMIUM_PLUS) {
        startDate = format(
          addDays(today, LAUNCH_SETTINGS.PREMIUM_PLUS_MIN_DAYS_AHEAD),
          DATE_FORMAT.API,
        )
        endDate = format(
          addDays(today, LAUNCH_SETTINGS.PREMIUM_PLUS_MAX_DAYS_AHEAD),
          DATE_FORMAT.API,
        )
      } else if (formData.launchType === LAUNCH_TYPES.PREMIUM) {
        startDate = format(addDays(today, LAUNCH_SETTINGS.PREMIUM_MIN_DAYS_AHEAD), DATE_FORMAT.API)
        endDate = format(addDays(today, LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD), DATE_FORMAT.API)
      } else {
        startDate = format(addDays(today, LAUNCH_SETTINGS.MIN_DAYS_AHEAD), DATE_FORMAT.API)
        endDate = format(addDays(today, LAUNCH_SETTINGS.MAX_DAYS_AHEAD), DATE_FORMAT.API)
      }

      const availability = await getLaunchAvailabilityRange(startDate, endDate, formData.launchType)
      setAvailableDates(availability)
    } catch (err) {
      console.error("Error loading dates:", err)
      setError("Failed to load available dates")
    } finally {
      setIsLoadingDates(false)
    }
  }, [formData.launchType])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (currentStep === 3) {
      loadAvailableDates()
    }
  }, [currentStep, loadAvailableDates])

  useEffect(() => {
    const tagsFromFormData = formData.techStack.map((tech, index) => ({
      id: `${index}-${tech}`,
      text: tech,
    }))
    if (JSON.stringify(tagsFromFormData) !== JSON.stringify(techStackTags)) {
      setTechStackTags(tagsFromFormData)
    }
  }, [formData.techStack])

  useEffect(() => {
    const techStringArray = techStackTags.map((tag) => tag.text)
    if (JSON.stringify(techStringArray) !== JSON.stringify(formData.techStack)) {
      setFormData((prev) => ({ ...prev, techStack: techStringArray }))
    }
  }, [techStackTags])

  async function fetchCategories() {
    setIsLoadingCategories(true)
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories")
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleLaunchTypeChange = (type: (typeof LAUNCH_TYPES)[keyof typeof LAUNCH_TYPES]) => {
    setFormData((prev) => ({
      ...prev,
      launchType: type,
      scheduledDate: null,
    }))
  }

  function groupDatesByMonth(dates: LaunchAvailability[]): DateGroup[] {
    const uniqueDates = Array.from(new Map(dates.map((date) => [date.date, date])).values())

    const groups = new Map<string, DateGroup>()

    const sortedDates = [...uniqueDates].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    sortedDates.forEach((date) => {
      const dateObj = new Date(date.date)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth()
      const groupKey = `${year}-${month}`
      const displayMonth = format(dateObj, DATE_FORMAT.DISPLAY_MONTH)

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          displayName: displayMonth,
          dates: [],
        })
      }
      groups.get(groupKey)?.dates.push(date)
    })

    return Array.from(groups.values()).sort((a, b) => {
      const aDate = new Date(a.dates[0].date)
      const bDate = new Date(b.dates[0].date)
      return aDate.getTime() - bDate.getTime()
    })
  }

  const validateLaunchDateLimit = useCallback(
    async (date: string | null) => {
      if (!date || !userId) {
        setIsLaunchDateOverLimit(false)
        setLaunchDateLimitError(null)
        setIsLoadingDateCheck(false)
        return
      }
      setIsLoadingDateCheck(true)
      setLaunchDateLimitError(null)
      try {
        const result = await checkUserLaunchLimit(userId, date)
        if (!result.allowed) {
          setIsLaunchDateOverLimit(true)
          setLaunchDateLimitError(
            `You have already scheduled ${result.count}/${result.limit} project(s) for this date. Please select another date.`,
          )
        } else {
          setIsLaunchDateOverLimit(false)
        }
      } catch (err) {
        console.error("Error checking launch date limit:", err)
        setIsLaunchDateOverLimit(false)
        setLaunchDateLimitError("Could not verify launch date limit. Please try again.")
      } finally {
        setIsLoadingDateCheck(false)
      }
    },
    [userId],
  )

  useEffect(() => {
    if (formData.scheduledDate && currentStep === 3) {
      validateLaunchDateLimit(formData.scheduledDate)
    }
  }, [formData.scheduledDate, currentStep, validateLaunchDateLimit])

  const nextStep = () => {
    setError(null)
    setLaunchDateLimitError(null)
    if (currentStep === 1) {
      if (
        !formData.name ||
        !formData.websiteUrl ||
        !formData.description ||
        (process.env.NODE_ENV !== "development" && (!uploadedLogoUrl || !uploadedCoverImageUrl))
      ) {
        setError("Please fill in all required project information and upload images.")
        return
      }
      try {
        new URL(formData.websiteUrl)
      } catch {
        setError("Please enter a valid website URL.")
        return
      }
    }

    if (currentStep === 2) {
      if (
        formData.categories.length === 0 ||
        formData.techStack.length === 0 ||
        formData.platforms.length === 0 ||
        !formData.pricing
      ) {
        setError("Please complete the technical details and categorization.")
        return
      }

      if (formData.categories.length > 3) {
        setError("You can select a maximum of 3 categories.")
        return
      }

      if (formData.techStack.length > 5) {
        setError("You can add a maximum of 5 technologies.")
        return
      }
    }

    if (currentStep === 3) {
      if (!formData.scheduledDate) {
        setError("Please select a launch date.")
        return
      }
      if (isLaunchDateOverLimit) {
        setError(launchDateLimitError || "This launch date is not available due to daily limit.")
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4))

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 0)
  }

  const prevStep = () => {
    setError(null)
    setLaunchDateLimitError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 0)
  }

  const handleFinalSubmit = async () => {
    if (
      !formData.name ||
      !formData.websiteUrl ||
      !formData.description ||
      (process.env.NODE_ENV !== "development" && (!uploadedLogoUrl || !uploadedCoverImageUrl)) ||
      formData.categories.length === 0 ||
      formData.platforms.length === 0 ||
      !formData.pricing
    ) {
      setError(
        "Some required information or images are missing. Please go back and complete all fields.",
      )
      setIsPending(false)
      return
    }

    const urlExists = await checkWebsiteUrl(formData.websiteUrl)
    if (urlExists) {
      setError("This website URL has already been submitted. Please use a different URL.")
      setIsPending(false)
      return
    }

    if (isLaunchDateOverLimit && formData.scheduledDate) {
      setError(
        launchDateLimitError || "Cannot submit: The selected launch date exceeds your daily limit.",
      )
      setIsPending(false)
      return
    }

    setIsPending(true)
    setError(null)
    setLaunchDateLimitError(null)

    if (formData.techStack.length === 0) {
      setError("Please enter at least one technology in the Tech Stack.")
      setIsPending(false)
      return
    }

    if (formData.categories.length > 3) {
      setError("You can select a maximum of 3 categories.")
      setIsPending(false)
      return
    }

    if (formData.techStack.length > 5) {
      setError("You can add a maximum of 5 technologies.")
      setIsPending(false)
      return
    }

    try {
      const finalLogoUrl =
        process.env.NODE_ENV === "development" && !uploadedLogoUrl
          ? "https://placehold.co/128x128/E2E8F0/718096?text=Logo"
          : uploadedLogoUrl!
      const finalCoverImageUrl =
        process.env.NODE_ENV === "development" && !uploadedCoverImageUrl
          ? "https://placehold.co/1080x480/E2E8F0/718096?text=Cover"
          : uploadedCoverImageUrl!

      const projectData = {
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        logoUrl: finalLogoUrl,
        coverImageUrl: finalCoverImageUrl,
        categories: formData.categories,
        techStack: formData.techStack,
        platforms: formData.platforms,
        pricing: formData.pricing,
        githubUrl: formData.githubUrl || null,
        twitterUrl: formData.twitterUrl || null,
      }

      const submissionResult = await submitProject(projectData)

      if (!submissionResult.success || !submissionResult.projectId || !submissionResult.slug) {
        throw new Error(submissionResult.error || "Failed to submit project data.")
      }

      const projectId = submissionResult.projectId
      const projectSlug = submissionResult.slug

      if (formData.scheduledDate) {
        try {
          const formattedDate = format(parseISO(formData.scheduledDate), DATE_FORMAT.API)
          const launchSuccess = await scheduleLaunch(
            projectId,
            formattedDate,
            formData.launchType,
            userId,
          )

          if (!launchSuccess) {
            console.error(
              `Project ${projectId} created but failed to schedule for ${formattedDate}`,
            )
            throw new Error("Project created, but failed to schedule the launch.")
          }

          try {
            await notifyDiscordLaunch(
              formData.name,
              format(parseISO(formData.scheduledDate), DATE_FORMAT.DISPLAY),
              formData.launchType,
              formData.websiteUrl,
              `${process.env.NEXT_PUBLIC_APP_URL || ""}/projects/${projectSlug}`,
            )
          } catch (discordError) {
            console.error("Failed to send Discord notification:", discordError)
          }
        } catch (scheduleError: unknown) {
          console.error("Error during launch scheduling:", scheduleError)
          setError(
            scheduleError instanceof Error
              ? scheduleError.message
              : "An error occurred during scheduling.",
          )
          setIsPending(false)
          return
        }
      }

      if (formData.launchType === LAUNCH_TYPES.FREE) {
        router.push(`/projects/${projectSlug}`)
      } else {
        const paymentLink =
          formData.launchType === LAUNCH_TYPES.PREMIUM
            ? PREMIUM_PAYMENT_LINK
            : PREMIUM_PLUS_PAYMENT_LINK

        const paymentUrl = `${paymentLink}?client_reference_id=${projectId}`

        window.location.href = paymentUrl
      }
    } catch (submissionError: unknown) {
      console.error("Error during final submission:", submissionError)
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "An unexpected error occurred.",
      )
      setIsPending(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleFinalSubmit()
  }

  const renderStepper = () => (
    <div className="mb-8 sm:mb-10">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between pt-2 sm:px-4 sm:pt-0">
          {[
            { step: 1, label: "Project Info", icon: RiListCheck },
            {
              step: 2,
              label: "Details",
              shortLabel: "Details",
              icon: RiInformation2Line,
            },
            { step: 3, label: "Launch Date", icon: RiCalendarLine },
            { step: 4, label: "Review", icon: RiFileCheckLine },
          ].map(({ step, label, shortLabel, icon: Icon }) => (
            <div
              key={`step-${step}`}
              className="relative flex w-[120px] flex-col items-center sm:w-[140px]"
            >
              {step < 3 && (
                <div className="absolute top-5 left-[calc(50%+1.5rem)] -z-10 hidden h-[2px] w-[calc(100%-1rem)] sm:block">
                  <div
                    className={`h-full ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    } transition-all duration-300`}
                  />
                </div>
              )}

              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 sm:h-12 sm:w-12 ${
                  currentStep > step
                    ? "bg-primary ring-primary/10 text-white ring-4"
                    : currentStep === step
                      ? "bg-primary ring-primary/20 text-white ring-4"
                      : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {currentStep > step ? (
                  <RiCheckLine className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}

                {currentStep === step && (
                  <span className="border-primary absolute inset-0 animate-pulse rounded-full border-2" />
                )}
              </div>

              <div className="mt-3 w-full text-center sm:mt-4">
                <span
                  className={`mb-0.5 block text-xs font-medium sm:text-sm ${
                    currentStep >= step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="inline sm:hidden">{shortLabel || label}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 px-2 sm:mt-6 sm:px-4">
        <div className="bg-muted/50 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )

  const handleCheckboxChange = (
    field: "categories" | "platforms",
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field] || []
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] }
      } else {
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        }
      }
    })
  }

  const handleRadioChange = (field: "pricing", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCategoryName = (id: string) => categories.find((cat) => cat.id === id)?.name || id
  const getPlatformLabel = (value: string) =>
    Object.entries(platformType)
      .find(([, v]) => v === value)?.[0]
      ?.toLowerCase() || value
  const getPricingLabel = (value: string) =>
    Object.entries(pricingType)
      .find(([, v]) => v === value)?.[0]
      ?.toLowerCase() || value

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">
                Website URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://myawesomeproject.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project in a sentence or two."
                required
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">
                Logo (Max 1MB) <span className="text-red-500">*</span>
              </Label>
              {uploadedLogoUrl ? (
                <div className="bg-muted/30 relative w-fit rounded-md border p-3">
                  <Image
                    src={uploadedLogoUrl}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="rounded object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground absolute top-1 right-1 h-6 w-6"
                    onClick={() => setUploadedLogoUrl(null)}
                    aria-label="Remove logo"
                  >
                    <RiCloseCircleLine className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <UploadButton
                    endpoint="projectLogo"
                    onUploadBegin={() => {
                      console.log("Upload Begin (Logo)")
                      setIsUploadingLogo(true)
                      setError(null)
                    }}
                    onClientUploadComplete={(res) => {
                      console.log("Upload Response (Logo):", res)
                      setIsUploadingLogo(false)
                      if (res && res.length > 0 && res[0].serverData?.fileUrl) {
                        setUploadedLogoUrl(res[0].serverData.fileUrl)
                        console.log("Logo URL set:", res[0].serverData.fileUrl)
                      } else {
                        console.error("Logo upload failed: No URL", res)
                        setError("Logo upload failed: No URL returned.")
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error("Upload Error (Logo):", error)
                      setIsUploadingLogo(false)
                      setError(`Logo upload failed: ${error.message}`)
                    }}
                    appearance={{
                      button: `ut-button border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm h-9 px-3 inline-flex items-center justify-center gap-2 ${isUploadingLogo ? "opacity-50 pointer-events-none" : ""}`,
                      allowedContent: "hidden",
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return <RiLoader4Line className="h-4 w-4 animate-spin" />
                        if (ready)
                          return (
                            <>
                              <RiImageAddLine className="h-4 w-4" /> Upload Logo
                            </>
                          )
                        return "Getting ready..."
                      },
                    }}
                  />
                  {isUploadingLogo && (
                    <span className="text-muted-foreground text-xs">Uploading...</span>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">
                Cover Image (Max 1MB) <span className="text-red-500">*</span>
              </Label>
              {uploadedCoverImageUrl ? (
                <div className="bg-muted/30 relative w-fit rounded-md border p-3">
                  <Image
                    src={uploadedCoverImageUrl}
                    alt="Cover image preview"
                    width={240}
                    height={135}
                    className="rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground absolute top-1 right-1 h-6 w-6"
                    onClick={() => setUploadedCoverImageUrl(null)}
                    aria-label="Remove cover image"
                  >
                    <RiCloseCircleLine className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <UploadButton
                    endpoint="projectCoverImage"
                    onUploadBegin={() => {
                      console.log("Upload Begin (Cover)")
                      setIsUploadingCover(true)
                      setError(null)
                    }}
                    onClientUploadComplete={(res) => {
                      console.log("Upload Response (Cover):", res)
                      setIsUploadingCover(false)
                      if (res && res.length > 0 && res[0].serverData?.fileUrl) {
                        setUploadedCoverImageUrl(res[0].serverData.fileUrl)
                        console.log("Cover URL set:", res[0].serverData.fileUrl)
                      } else {
                        console.error("Cover upload failed: No URL", res)
                        setError("Cover image upload failed: No URL returned.")
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error("Upload Error (Cover):", error)
                      setIsUploadingCover(false)
                      setError(`Cover image upload failed: ${error.message}`)
                    }}
                    appearance={{
                      button: `ut-button flex items-center w-fit gap-2 border border-input bg-primary hover:bg-primary/90 hover:text-accent-foreground text-sm h-9 px-3 ${isUploadingCover ? "opacity-50 pointer-events-none" : ""}`,
                      allowedContent: "hidden",
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return <RiLoader4Line className="h-4 w-4 animate-spin" />
                        if (ready)
                          return (
                            <>
                              <RiImageAddLine className="h-4 w-4" /> Upload Cover Image
                            </>
                          )
                        return "Getting ready..."
                      },
                    }}
                  />
                  {isUploadingCover && (
                    <span className="text-muted-foreground text-xs">Uploading...</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <Label className="mb-2 block">
                Categories <span className="text-red-500">*</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  ({formData.categories.length}/3 selected)
                </span>
              </Label>
              {isLoadingCategories ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <RiLoader4Line className="h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : categories.length > 0 ? (
                <div className="max-h-60 space-y-3 overflow-y-auto rounded-md border p-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={formData.categories.includes(cat.id)}
                        onCheckedChange={(checked) => {
                          if (checked && formData.categories.length >= 3) {
                            setError("You can select a maximum of 3 categories.")
                            return
                          }
                          handleCheckboxChange("categories", cat.id, !!checked)
                        }}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer font-normal">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No categories available.</p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Select up to 3 relevant categories.
              </p>
            </div>

            <div>
              <Label htmlFor={tagInputId}>
                Tech Stack <span className="text-red-500">*</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  ({formData.techStack.length}/5 technologies)
                </span>
              </Label>
              <TagInput
                id={tagInputId}
                tags={techStackTags}
                setTags={(newTags) => {
                  if (newTags.length > 5) {
                    setError("You can add a maximum of 5 technologies.")
                    return
                  }
                  setTechStackTags(newTags)
                }}
                placeholder="Type a technology and press Enter..."
                styleClasses={{
                  inlineTagsContainer:
                    "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 mt-1",
                  input: "w-full min-w-[80px] shadow-none px-2 h-7",
                  tag: {
                    body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                    closeButton:
                      "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                  },
                }}
                activeTagIndex={activeTechTagIndex}
                setActiveTagIndex={setActiveTechTagIndex}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Enter up to 5 technologies used, press Enter or comma to add a tag.
              </p>
            </div>

            <div>
              <Label className="mb-2 block">
                Platforms <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3 rounded-md border p-4">
                {Object.entries(platformType).map(([key, value]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${value}`}
                      checked={formData.platforms.includes(value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("platforms", value, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`platform-${value}`}
                      className="cursor-pointer font-normal capitalize"
                    >
                      {key.toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Select all platforms your project supports.
              </p>
            </div>

            <div>
              <Label className="mb-2 block">
                Pricing Model <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.pricing}
                onValueChange={(value) => handleRadioChange("pricing", value)}
                className="flex flex-col gap-4 sm:flex-row"
              >
                {Object.entries(pricingType).map(([key, value]) => (
                  <div key={value} className="flex-1">
                    <Label
                      htmlFor={`pricing-${value}`}
                      className="hover:bg-muted/50 flex h-full cursor-pointer items-center space-x-2 rounded-md border p-3 transition-colors"
                    >
                      <RadioGroupItem value={value} id={`pricing-${value}`} />
                      <span className="font-normal capitalize">{key.toLowerCase()}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter URL (Optional)</Label>
                <Input
                  id="twitterUrl"
                  name="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <RiCalendarLine className="h-5 w-5" />
              <h3 className="text-lg font-medium">Choose Launch Type & Date</h3>
            </div>

            <div className="bg-muted/30 border-muted flex items-start gap-2 rounded-lg border p-3 sm:p-4">
              <RiInformationLine className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-medium">Select your launch type and date</p>
                <p className="text-muted-foreground mt-1">
                  All launches happen at {LAUNCH_SETTINGS.LAUNCH_HOUR_UTC}:00 UTC. We launch a
                  limited number of projects each day.
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium">Launch Type</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-150 ${formData.launchType === LAUNCH_TYPES.FREE ? "border-primary ring-primary bg-primary/5 relative shadow-sm ring-1" : "hover:border-foreground/20 hover:bg-muted/50"}`}
                  onClick={() => handleLaunchTypeChange(LAUNCH_TYPES.FREE)}
                >
                  {formData.launchType === LAUNCH_TYPES.FREE && (
                    <Badge
                      variant="default"
                      className="bg-primary text-primary-foreground absolute -top-2 -right-2 text-xs"
                    >
                      Selected
                    </Badge>
                  )}
                  <h5 className="mb-2 flex items-center gap-1.5 font-medium">
                    <RiRocketLine className="h-4 w-4" />
                    Free Launch
                  </h5>
                  <p className="mb-3 text-2xl font-bold">$0</p>
                  <ul className="text-muted-foreground space-y-1.5 text-xs">
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-foreground/60 h-3.5 w-3.5 flex-shrink-0" />
                      <span>{LAUNCH_LIMITS.FREE_DAILY_LIMIT} slots/day</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-foreground/60 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Standard visibility</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-foreground/60 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Up to {LAUNCH_SETTINGS.MAX_DAYS_AHEAD} days scheduling</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-foreground/60 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Dofollow Backlink if Top 3 daily</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-150 ${formData.launchType === LAUNCH_TYPES.PREMIUM ? "border-primary/70 ring-primary/70 bg-primary/5 relative shadow-sm ring-1" : "hover:border-primary/50 hover:bg-primary/5"}`}
                  onClick={() => handleLaunchTypeChange(LAUNCH_TYPES.PREMIUM)}
                >
                  {formData.launchType === LAUNCH_TYPES.PREMIUM && (
                    <Badge
                      variant="default"
                      className="bg-primary text-primary-foreground absolute -top-2 -right-2 text-xs"
                    >
                      Selected
                    </Badge>
                  )}
                  <h5 className="mb-2 flex items-center gap-1.5 font-medium">
                    <RiStarLine className="text-primary h-4 w-4" />
                    Premium Launch
                  </h5>
                  <p className="mb-3 text-2xl font-bold">${LAUNCH_SETTINGS.PREMIUM_PRICE}</p>
                  <ul className="text-muted-foreground space-y-1.5 text-xs">
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Skip the Free Queue - Priority access</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5 flex-shrink-0" />
                      <span>{LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT} premium slots/day</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Guaranteed Dofollow Backlink</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary/80 h-3.5 w-3.5 flex-shrink-0" />
                      <span>Up to {LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD} days scheduling</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-150 ${
                    formData.launchType === LAUNCH_TYPES.PREMIUM_PLUS
                      ? "border-primary ring-primary bg-primary/5 relative shadow-sm ring-1"
                      : "hover:border-primary hover:bg-primary/5"
                  }`}
                  onClick={() => handleLaunchTypeChange(LAUNCH_TYPES.PREMIUM_PLUS)}
                >
                  {formData.launchType === LAUNCH_TYPES.PREMIUM_PLUS && (
                    <Badge
                      variant="default"
                      className="bg-primary text-primary-foreground absolute -top-2 -right-2 text-xs"
                    >
                      Selected
                    </Badge>
                  )}
                  <h5 className="mb-2 flex items-center gap-1.5 font-medium">
                    <RiVipCrownLine className="text-primary h-4 w-4" />
                    Premium Plus
                  </h5>
                  <p className="mb-1 text-2xl font-bold">
                    ${LAUNCH_SETTINGS.PREMIUM_PLUS_PRICE}{" "}
                    <span className="text-muted-foreground text-xs line-through">$25</span>
                  </p>
                  <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-0.5 text-xs">
                    -50% code: OPENLAUNCH
                  </span>
                  <ul className="text-muted-foreground space-y-1.5 text-xs">
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span>Premium Spotlight Placement</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span>{LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT} exclusive slots/day</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span>Guaranteed Dofollow Backlink</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span>
                        Up to {LAUNCH_SETTINGS.PREMIUM_PLUS_MAX_DAYS_AHEAD} days scheduling
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium">
                Launch Date <span className="text-red-500">*</span>
              </h4>
              {isLoadingDates ? (
                <div className="text-muted-foreground flex items-center justify-center gap-2 py-4">
                  <RiLoader4Line className="h-5 w-5 animate-spin" /> Loading available dates...
                </div>
              ) : availableDates.length === 0 && !isLoadingDates ? (
                <p className="text-muted-foreground rounded-md border p-4 text-center text-sm">
                  No available launch dates found for the selected type in the allowed range.
                </p>
              ) : (
                <div>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, scheduledDate: value }))
                    }
                    value={formData.scheduledDate || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a launch date" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupDatesByMonth(availableDates).map((group) => (
                        <SelectGroup key={group.key}>
                          <SelectLabel>{group.displayName}</SelectLabel>
                          {group.dates.map((date) => {
                            const dateObj = parseISO(date.date)
                            let slotsAvailable = 0
                            let isDisabled = true
                            if (formData.launchType === LAUNCH_TYPES.FREE) {
                              slotsAvailable = date.freeSlots
                              isDisabled = date.freeSlots <= 0
                            } else if (formData.launchType === LAUNCH_TYPES.PREMIUM) {
                              slotsAvailable = date.premiumSlots
                              isDisabled = date.premiumSlots <= 0
                            } else if (formData.launchType === LAUNCH_TYPES.PREMIUM_PLUS) {
                              slotsAvailable = date.premiumPlusSlots
                              isDisabled = date.premiumPlusSlots <= 0
                            }

                            if (date.totalSlots <= 0) isDisabled = true

                            const slotsText = `${slotsAvailable} ${formData.launchType === LAUNCH_TYPES.FREE ? "free" : formData.launchType === LAUNCH_TYPES.PREMIUM ? "premium" : "premium+"} slot(s)`

                            return (
                              <SelectItem
                                key={date.date}
                                value={date.date}
                                disabled={isDisabled}
                                className="group text-sm"
                              >
                                <div className="flex w-full items-center justify-between">
                                  <span>{format(dateObj, "EEE, MMM d")}</span>
                                  <span
                                    className={`ml-2 text-xs ${isDisabled ? "text-muted-foreground/50" : "text-muted-foreground group-hover:text-foreground"}`}
                                  >
                                    {slotsText}
                                  </span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>

                  {launchDateLimitError && (
                    <p className="text-destructive mt-2 text-xs sm:text-sm">
                      {launchDateLimitError}
                    </p>
                  )}

                  {formData.scheduledDate && !isLaunchDateOverLimit && (
                    <div className="bg-primary/5 border-primary/10 mt-3 flex w-fit items-center gap-1.5 rounded-md border px-3 py-2 text-sm">
                      <RiCalendarLine className="text-primary/80 h-4 w-4" />
                      <span className="text-muted-foreground">Scheduled for </span>
                      <span className="text-foreground font-medium">
                        {format(parseISO(formData.scheduledDate), DATE_FORMAT.DISPLAY)}
                      </span>
                      <span className="text-muted-foreground/70 ml-1 text-xs">
                        • {LAUNCH_SETTINGS.LAUNCH_HOUR_UTC}:00 UTC
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <RiCheckLine className="h-5 w-5" />
              <h3 className="text-lg font-medium">Review and Submit</h3>
            </div>

            <div className="bg-card overflow-hidden rounded-lg border">
              <div className="space-y-6 p-6">
                <div>
                  <h4 className="mb-3 border-b pb-2 text-base font-semibold">
                    Project Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={formData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {formData.websiteUrl}
                      </a>
                    </p>
                    <p>
                      <strong>Description:</strong> {formData.description}
                    </p>
                    {uploadedLogoUrl && (
                      <p className="flex flex-col items-start gap-2">
                        <strong>Logo:</strong>
                        <Image
                          src={uploadedLogoUrl}
                          alt="Uploaded logo"
                          width={48}
                          height={48}
                          className="rounded border"
                        />
                      </p>
                    )}
                    {uploadedCoverImageUrl && (
                      <p className="flex flex-col items-start gap-2">
                        <strong>Cover Image:</strong>
                        <Image
                          src={uploadedCoverImageUrl}
                          alt="Uploaded cover image"
                          width={128}
                          height={72}
                          className="rounded border object-cover"
                        />
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 border-b pb-2 text-base font-semibold">Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Categories:</strong>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.categories.map((catId) => (
                          <Badge key={catId} variant="secondary">
                            {getCategoryName(catId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Tech Stack:</strong>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.techStack.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Platforms:</strong>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.platforms.map((plat) => (
                          <Badge key={plat} variant="secondary" className="capitalize">
                            {getPlatformLabel(plat)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p>
                      <strong>Pricing:</strong>{" "}
                      <span className="capitalize">
                        <Badge variant="outline">{getPricingLabel(formData.pricing)}</Badge>
                      </span>
                    </p>
                    {formData.githubUrl && (
                      <p>
                        <strong>GitHub:</strong>{" "}
                        <a
                          href={formData.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {formData.githubUrl}
                        </a>
                      </p>
                    )}
                    {formData.twitterUrl && (
                      <p>
                        <strong>Twitter:</strong>{" "}
                        <a
                          href={formData.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {formData.twitterUrl}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 border-b pb-2 text-base font-semibold">Launch Plan</h4>
                  <div className="flex flex-col gap-4 text-sm sm:flex-row">
                    <div
                      className={`flex w-fit items-center gap-2 rounded-md border px-3 py-2 ${
                        formData.launchType === LAUNCH_TYPES.FREE
                          ? "bg-foreground/5 border-foreground/10"
                          : formData.launchType === LAUNCH_TYPES.PREMIUM
                            ? "bg-primary/5 border-primary/20"
                            : "bg-primary/5 border-primary/20"
                      }`}
                    >
                      {formData.launchType === LAUNCH_TYPES.FREE && (
                        <>
                          <RiRocketLine className="text-foreground/70 h-4 w-4" />{" "}
                          <span className="text-foreground/70 font-medium">Free Launch</span>
                        </>
                      )}
                      {formData.launchType === LAUNCH_TYPES.PREMIUM && (
                        <>
                          <RiStarLine className="text-primary h-4 w-4" />{" "}
                          <span className="text-primary font-medium">
                            Premium Launch (${LAUNCH_SETTINGS.PREMIUM_PRICE})
                          </span>
                        </>
                      )}
                      {formData.launchType === LAUNCH_TYPES.PREMIUM_PLUS && (
                        <>
                          <RiVipCrownLine className="text-primary h-4 w-4" />{" "}
                          <div className="text-primary font-medium">
                            <div>
                              Premium Plus (${LAUNCH_SETTINGS.PREMIUM_PLUS_PRICE}){" "}
                              <span className="text-muted-foreground text-xs line-through">
                                $25
                              </span>
                            </div>
                            <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-0.5 text-xs">
                              -50% code: OPENLAUNCH
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="bg-muted/30 flex h-full min-h-[60px] w-fit flex-col justify-center rounded-md border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <RiCalendarLine className="text-muted-foreground h-4 w-4" />
                        <span>
                          {formData.scheduledDate
                            ? format(parseISO(formData.scheduledDate), DATE_FORMAT.DISPLAY)
                            : "No date selected"}
                        </span>
                      </div>
                      {formData.scheduledDate && (
                        <span className="text-muted-foreground/70 ml-6 text-xs">
                          {LAUNCH_SETTINGS.LAUNCH_HOUR_UTC}:00 UTC
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border-t px-6 py-4">
                <div className="flex items-start gap-3">
                  <RiInformationLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Ready to submit?</p>
                    <p className="text-muted-foreground text-xs">
                      Please review all information carefully. Once submitted, your project will be
                      scheduled for launch.
                      {formData.launchType !== LAUNCH_TYPES.FREE && (
                        <span className="mt-1 block">
                          You will be redirected to the payment page after submission.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {renderStepper()}

      {error && (
        <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-md border p-3 text-sm">
          {error}
        </div>
      )}

      {renderStepContent()}

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isPending || isUploadingLogo || isUploadingCover}
        >
          <RiArrowLeftLine className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={
              isPending ||
              isUploadingLogo ||
              isUploadingCover ||
              (currentStep === 3 && isLoadingDateCheck)
            }
          >
            {currentStep === 3 && isLoadingDateCheck && (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            )}
            Next
            <RiArrowRightLine className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isPending || isUploadingLogo || isUploadingCover}
          >
            {isPending ? (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RiRocketLine className="mr-2 h-4 w-4" />
            )}
            Submit Project
          </Button>
        )}
      </div>
    </form>
  )
}
