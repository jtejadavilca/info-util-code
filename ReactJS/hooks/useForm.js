import { useState } from "react";

export const useForm = (initialForm = {}, inputFocus) => {
    const [formState, setFormState] = useState(initialForm);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const onReset = () => {
        setFormState(initialForm);
        if (inputFocus?.current) {
            inputFocus.current.focus();
        }
    };

    return {
        ...formState,
        formState,
        onInputChange,
        onReset,
    };
};
