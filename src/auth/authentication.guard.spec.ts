import { UnauthorizedException } from "@nestjs/common"
import { AuthenticationGuard } from "./authentication.guard"
import { JwtRsaVerifier } from "aws-jwt-verify";

jest.mock('aws-jwt-verify', () => ({
    JwtRsaVerifier: { create: jest.fn(() => ({ verify: jest.fn() })) }
}))

const configServiceMock = {
    get: jest.fn(),
}

const reflectorMock = {
    get: jest.fn(),
}

describe('authentication guard', () => {

    let testGuard: AuthenticationGuard;

    beforeAll(() => {
        testGuard = new AuthenticationGuard(configServiceMock as any, reflectorMock as any);
    })

    it('should return true when endpoint is decorated with SkipAuth', async () => {
        reflectorMock.get.mockReturnValueOnce(true)

        const testContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { ['authorization']: undefined }
                })
            }),
            getHandler: jest.fn(),
        }

        const result = await testGuard.canActivate(testContext as any)

        expect(result).toEqual(true);
    })

    it('should throw Unauthorized when authorization token is not present on request', async () => {
        reflectorMock.get.mockReturnValueOnce(false)

        const testContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { ['authorization']: undefined }
                })
            }),
            getHandler: jest.fn(),
        }

        let result;
        let error;
        try {
            result = await testGuard.canActivate(testContext as any)
        } catch (e) {
            error = e
        }

        expect(result).not.toBeDefined()
        expect(error).toBeInstanceOf(UnauthorizedException)
    })

    it('should throw Unauthorized when token verification fails', async () => {
        reflectorMock.get.mockImplementationOnce(() => false);

        (JwtRsaVerifier.create as any).mockReturnValueOnce({ verify: () => { throw new Error('verification error') } });

        const testGuardInstance = new AuthenticationGuard(configServiceMock as any, reflectorMock as any);

        const testContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { ['authorization']: 'tokennn' }
                })
            }),
            getHandler: jest.fn(),
        }

        let result;
        let error;
        try {
            result = await testGuardInstance.canActivate(testContext as any)
        } catch (e) {
            error = e
        }

        expect(result).not.toBeDefined();
        expect(error).toBeInstanceOf(UnauthorizedException);
    })

    it('should return true when authorization token passes verification', async () => {
        reflectorMock.get.mockImplementationOnce(() => false);

        (JwtRsaVerifier.create as any).mockReturnValueOnce({ verify: () => ({}) });

        const testGuardInstance = new AuthenticationGuard(configServiceMock as any, reflectorMock as any);

        const testContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { ['authorization']: 'Bearer tokennn' }
                })
            }),
            getHandler: jest.fn(),
        }

        const result = await testGuardInstance.canActivate(testContext as any);

        expect(result).toEqual(true);
    })
})