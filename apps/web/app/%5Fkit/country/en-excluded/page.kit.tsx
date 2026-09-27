import { KitCountry, kitCountryMetadata } from '../KitCountry'

export const metadata = kitCountryMetadata

export default function Page() {
  return <KitCountry view="en-excluded" />
}
