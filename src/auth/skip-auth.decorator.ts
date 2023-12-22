import { SetMetadata } from "@nestjs/common";

export const SkipAuthToken = "skip-auth";

export const SkipAuth = () => SetMetadata(SkipAuthToken, true);
