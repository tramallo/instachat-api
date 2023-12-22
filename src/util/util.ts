import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationError, validateSync } from "class-validator";

export function envValidationFunction<T extends Object>(envObject: Record<string, unknown>, schema: ClassConstructor<T>): T {
    const configAsClassObject = plainToInstance(schema, envObject, { enableImplicitConversion: true })

    const validationErrors: ValidationError[] = validateSync(configAsClassObject)

    if(validationErrors.length) {
        const validationErrorsAsString = validationErrorArrayToStringArray(validationErrors)
        throw new Error(`Validation failed \n${validationErrorsAsString.join('\n')}`)
    }

    return configAsClassObject;
}

export const validationErrorArrayToStringArray = (validationErrors: ValidationError[]): string[] => {
    const messages = validationErrors
        .map(validationError => validationErrorConstraintsToString(validationError))
        .flat()
    
    return messages;
}

export const validationErrorConstraintsToString = (validationError: ValidationError): string[] => {
    let failedConstraintsMessages = Object.values(validationError.constraints!)

    return failedConstraintsMessages;
}