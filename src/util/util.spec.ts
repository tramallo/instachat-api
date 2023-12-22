import "reflect-metadata";
import { IsArray, IsDefined, ValidationError } from 'class-validator';
import { envValidationFunction, validationErrorArrayToStringArray } from './util';

describe('util', () => {

    describe('env validation function', () => {

        class TestSchema {
            @IsDefined()
            private id?: string

            @IsArray()
            private array?: string[]
        }

        it('should be defined', () => {
            expect(envValidationFunction).toBeDefined()
        })

        it('should return the input as class instance when validation succeeds', () => {
            const inputObject = { id: 'some_id', array: ['array_value'] };

            const output = envValidationFunction(inputObject, TestSchema);

            expect(output).toBeInstanceOf(TestSchema)
        })

        it('should throw the failed constraints as error when validation fails', () => {
            const inputObject = { array: 'string_value' };

            let output;
            let error;
            try {
                output = envValidationFunction(inputObject, TestSchema);
            } catch (e) {
                error = e as Error;
            }

            expect(output).not.toBeDefined();
            expect(error!.message).toContain('id should not be null or undefined');
            expect(error!.message).toContain('array must be an array');
        })

    })

    describe('validation errors to string', () => {
        const testConstraint1 = 'object must be constraint1';
        const testConstraint2 = 'object must not be constraint2';
        const testConstraint3 = 'object must greater than constraint3';

        const testErrors: ValidationError[] = [
            { property: 'property1_name', constraints: { 
                    firstConstraint: testConstraint1, 
                    secondConstraint: testConstraint2, 
                }
            },
            { property: 'property2_name', constraints: {
                    firstConstraint: testConstraint1,
                    secondConstraint: testConstraint3,
                }
            }
        ]

        it('shoudl return a string array containing all the constraints in the input errors', () => {
            const output = validationErrorArrayToStringArray(testErrors);

            expect(output).toEqual([testConstraint1, testConstraint2, testConstraint1, testConstraint3])
        })
    })
})