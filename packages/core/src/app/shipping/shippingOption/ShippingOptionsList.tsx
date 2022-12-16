import {  Cart, ShippingOption} from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'; //add memo 
import { CheckoutContextProps , withCheckout } from '../../checkout';
import { EMPTY_ARRAY } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { LoadingOverlay } from '../../ui/loading';

import StaticShippingOption from './StaticShippingOption';

interface ShippingOptionListItemProps {
    consignmentId: string;
    shippingOption: ShippingOption;
}

const ShippingOptionListItem: FunctionComponent<ShippingOptionListItemProps> = ({
    consignmentId,
    shippingOption,
}) => {
    const renderLabel = useCallback(
        () => (
            <div className="shippingOptionLabel">
                <StaticShippingOption displayAdditionalInformation={true} method={shippingOption} />
            </div>
        ),
        [shippingOption],
    );

    return (
        <ChecklistItem
            htmlId={`shippingOptionRadio-${consignmentId}-${shippingOption.id}`}
            label={renderLabel}
            value={shippingOption.id}
        />
    );
};

export interface ShippingOptionListProps {
    consignmentId: string;
    inputName: string;
    isLoading: boolean;
    selectedShippingOptionId?: string;
    shippingOptions?: ShippingOption[];
    onSelectedOption(consignmentId: string, shippingOptionId: string): void;
}


export interface WithCheckoutShippingProps {
    cart: Cart;
}

const ShippingOptionsList: FunctionComponent<ShippingOptionListProps & WithCheckoutShippingProps>  = ({
    consignmentId,
    inputName,
    isLoading,
    shippingOptions = EMPTY_ARRAY,
    selectedShippingOptionId,
    onSelectedOption,
    cart,
}) => {
    const handleSelect = useCallback(
        (value: string) => {
            onSelectedOption(consignmentId, value);
        },
        [consignmentId, onSelectedOption],
    );

    if (!shippingOptions.length) {
        return null;
    }

    const shippingCost = "8706727f0a72a08c11ee2e793135df5d";
    const [data , setData ]= useState(shippingOptions);

    const afterData = data.filter((item)=>{
        return item.id !== shippingCost;
    })

    useEffect(()=>{
        if(cart.cartAmount > 10000){
            setData(afterData);
        }
    },[]);

    console.log("=================="+cart.baseAmount , cart.cartAmount);

    return (
        <LoadingOverlay isLoading={isLoading}>
            <Checklist
                aria-live="polite"
                defaultSelectedItemId={selectedShippingOptionId}
                name={inputName}
                onSelect={handleSelect}
            >
                {data.map((shippingOption) => (
                    <ShippingOptionListItem
                        consignmentId={consignmentId}
                        key={shippingOption.id}
                        shippingOption={shippingOption}
                    />
                ))}
            </Checklist>
        </LoadingOverlay>
    );
};



export function mapToDonationProps({
    checkoutState,
}: CheckoutContextProps): WithCheckoutShippingProps | null {
    const {
        data: {
            getCart,
            getCheckout,
        }
    } = checkoutState;

    const checkout = getCheckout();
    const cart = getCart();
    // const consignments = getConsignments() || [];

    if (!checkout || !cart) {
        return null;
    }

    return {
        cart,
    };
}

export default withCheckout(mapToDonationProps)(ShippingOptionsList);

