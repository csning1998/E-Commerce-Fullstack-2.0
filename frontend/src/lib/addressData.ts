import addressData from "./addressData.json";

export type District = { name: string; zipCode: string };
export type City = { name: string; zipCode: string; districts?: District[] };

export type Address = {
    country: string;
    state?: string;
    city?: string;
    district?: string;
    street?: string;
    zipCode?: string;
    [key: string]: any;
};

export type AddressField = {
    key: string;
    label: string;
    type: "select-box" | "text";
    items?: string[];
};

export const countries: string[] = ["Taiwan", "United States"];

export const cities: Record<string, City[]> = { ...addressData };

export function getCityNames(state: string): string[] {
    if (!state || !cities[state]) return [];
    return cities[state].map((city: City) => city.name);
}

export function getDistrictNames(state: string, cityName: string): string[] {
    const stateCities: City[] = cities[state];
    if (!stateCities) return [];

    const city: City | undefined = stateCities.find(
        (c: City): boolean => c.name === cityName,
    );
    if (!city || !city.districts) return [];

    return city.districts.map((district: District) => district.name);
}

export function resetAddressFields(address: Address): void {
    // @ts-ignore
    for (const key: string of [
        "state",
        "city",
        "district",
        "street",
        "zipCode",
    ]) {
        address[key] = "";
    }
}

export function onCountryChange(newCountry: string, address: Address): void {
    address.country = newCountry;
    resetAddressFields(address);

    if (newCountry === "Taiwan") {
        address.state = "Taiwan";
    }
}

const addressFieldsConfig: Record<string, AddressField[]> = {
    Taiwan: [
        { key: "city", label: "City / County", type: "select-box" },
        { key: "district", label: "District", type: "select-box" },
        { key: "street", label: "Street Address", type: "text" },
        { key: "zipCode", label: "Zip Code", type: "text" },
    ],
    UnitedStates: [
        { key: "state", label: "State", type: "select-box" },
        { key: "city", label: "City", type: "select-box" },
        { key: "street", label: "Street Address", type: "text" },
        { key: "zipCode", label: "Zip Code", type: "text" },
    ],
};

function getFieldsByCountry(country: string): AddressField[] {
    const normalizedCountry: string = country.replace(/\s+/g, "");
    return addressFieldsConfig[normalizedCountry] || [];
}

export function dynamicFieldsFor(address: Address): AddressField[] {
    return getFieldsByCountry(address.country).map((field: AddressField) => {
        const newField: {
            label: string;
            type: "select-box" | "text";
            items?: string[];
            key: string;
        } = { ...field };

        if (address.country === "Taiwan" && !address.state) {
            address.state = "Taiwan";
        }

        switch (newField.key) {
            case "state":
                newField.items =
                    address.country === "United States"
                        ? [
                              "Alabama",
                              "Alaska",
                              "Arizona",
                              "Arkansas",
                              "California",
                              "Colorado",
                              "Connecticut",
                              "Delaware",
                              "Florida",
                              "Georgia",
                              "Hawaii",
                              "Idaho",
                              "Illinois",
                              "Indiana",
                              "Iowa",
                              "Kansas",
                              "Kentucky",
                              "Louisiana",
                              "Maine",
                              "Maryland",
                              "Massachusetts",
                              "Michigan",
                              "Minnesota",
                              "Mississippi",
                              "Missouri",
                              "Montana",
                              "Nebraska",
                              "Nevada",
                              "New Hampshire",
                              "New Jersey",
                              "New Mexico",
                              "New York",
                              "North Carolina",
                              "North Dakota",
                              "Ohio",
                              "Oklahoma",
                              "Oregon",
                              "Pennsylvania",
                              "Rhode Island",
                              "South Carolina",
                              "South Dakota",
                              "Tennessee",
                              "Texas",
                              "Utah",
                              "Vermont",
                              "Virginia",
                              "Washington",
                              "West Virginia",
                              "Wisconsin",
                              "Wyoming",
                          ]
                        : [];
                break;
            case "city":
                if (address.state) {
                    newField.items = getCityNames(address.state);
                } else {
                    newField.items = [];
                }
                break;
            case "district":
                if (address.state && address.city) {
                    newField.items = getDistrictNames(
                        address.state,
                        address.city,
                    );
                } else {
                    newField.items = [];
                }
                break;
            case "street":
                newField.items = [];
                break;
        }

        return newField;
    });
}
