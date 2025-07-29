import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private config: ConfigService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['x-api-key'];
        if (!token || token != this.config.getOrThrow('API_KEY')) {
            throw new UnauthorizedException();
        }
        return true;
    }
}