export interface AlarmMessage {
  id: string
  type: string
  triggerId: string
  name: string
  success: boolean
  datetime: string
  location: Location
  data: RuleData[]
}

interface RuleData {
  success: boolean
  rule: string[]
  data: AlarmContent[]
}

export interface AlarmContent {
  imageUrl: string
  id: string
  text: string
  title: string
  sender: string
  colorCode: string
  colorText: string
  eventName: string
  eventId: string
  identifier: string
  locationV3: string
  date: string
  expiredAt: string
  references: string
  status: string
  regionId: string
}

export interface Location {
  v3: string
}
