import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtRsaVerifier } from "aws-jwt-verify";
import { SkipAuthToken } from "./skip-auth.decorator";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private jwtVerifier;

  constructor(private config: ConfigService, private reflector: Reflector) {
    const auth0Issuer = config.get("AUTH0_ISSUER_URL") as string;
    const auth0Audience = config.get("AUTH0_AUDIENCE") as string;

    this.jwtVerifier = JwtRsaVerifier.create({
      issuer: auth0Issuer,
      audience: auth0Audience,
      jwksUri: `${auth0Issuer}.well-known/jwks.json`,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get(SkipAuthToken, context.getHandler());
    if (skipAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Authorization token not found");
    }

    try {
      const payload = await this.jwtVerifier.verify(token as string);
      request["user"] = payload;
    } catch (error) {
      throw new UnauthorizedException(
        "Authorization token verification failed"
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Record<string, any> is a workaround for a problem mentioned here https://stackoverflow.com/a/52329953
    const requestHeaders = request.headers as Record<string, any>;
    const authorizationHeader = requestHeaders["authorization"];

    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(" ");

    return token ?? undefined;
  }
}
