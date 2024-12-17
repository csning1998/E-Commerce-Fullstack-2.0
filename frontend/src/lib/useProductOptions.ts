import { ref } from "vue";
import type { Ref } from "vue";

export function useProductOptions(): {
    // selectedOptions: Ref<Record<number, Record<string, string | number>>>;

    selectedOptions: any;
    calculateTotalPrice: (product: Products) => {
        bestPrice: number;
        discountPrice: number;
    };
    areAllOptionsSelected: (product: Products) => boolean;
} {
    const selectedOptions = ref({});

    // Calculate the price in the product obj
    const calculateTotalPrice = (
        product: Products,
    ): { bestPrice: number; discountPrice: number } => {
        let bestPrice = product.basePrice;
        let discountPrice = product.discountPrice || product.basePrice;

        const options = selectedOptions.value[product.id] || {};

        product.options.forEach((option): void => {
            const selectedValue = options[option.name];
            const matchedValue = option.values.find(
                (value) => value.value === selectedValue,
            );

            if (matchedValue?.priceAdj) {
                bestPrice += matchedValue.priceAdj;
                discountPrice += matchedValue.priceAdj;
            }
        });

        return { bestPrice, discountPrice };
    };

    //
    const areAllOptionsSelected = (product: Products): boolean => {
        const options = selectedOptions.value[product.id];
        if (!options) return false;

        return product.options.every(
            (option) => options[option.name] !== undefined,
        );
    };

    return {
        selectedOptions,
        calculateTotalPrice,
        areAllOptionsSelected,
    };
}
