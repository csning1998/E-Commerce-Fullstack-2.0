/// <reference types="vite/client" />

interface LoginFormData {
    userId: string;
    userPassword: string;
}

interface RegistrationFormData {
    userId: string;
    userEmail: string;
    userPassword: string;
    confirmPassword: string;
}

interface UserProfileFormData {
    id: number;
    userId: string;
    userFamilyName: string;
    userGivenName: string;
    userEmail: string;
    userIdentity?: string;
    userBirthday?: string;
    userPhoneNumber?: string;
    userProfilePicture?: string | null;
    userProfilePictureUrl?: string | null;
    userGender?: string;
    userCurrency?: string | null;
    userPermission?: string | null;
    userAddress?: UserAddress[];
    userPayments?: UserPayments[];
    userOAuthToken?: string | null;
    userOAuthProvider?: string | null;
    createdAt: number | string;
    updatedAt: number | string;
}

interface UserAddress {
    street: string;
    city: string;
    state: StateName;
    district: string;
    zipCode: string;
    country: Country;
}

interface UserPayments {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: number | string;
}

interface Products {
    _id: string;
    id: number;
    brand: string;
    link2Pic: string;
    basePrice: number;
    discountPrice: number;
    collection: string;
    title: string;
    options: ProductOption[];
}

interface ProductOption {
    name: string;
    values: {
        value: string | number;
        priceAdj?: number;
        stock?: number;
    }[];
}

interface CartItem extends Products {
    selectedOptions: Record<string, string | number>;
}

/* Declaration for SellerProductManagementView */

interface SizeOption {
    value: number;
    priceAdj: number;
}

interface ColorOption {
    value: string;
}

interface ProductOption {
    name: "Size" | "Color";
    values: SizeOption[] | ColorOption[];
}
