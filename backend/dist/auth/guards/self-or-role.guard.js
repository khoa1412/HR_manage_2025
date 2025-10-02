"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfOrRoleGuard = void 0;
const common_1 = require("@nestjs/common");
let SelfOrRoleGuard = class SelfOrRoleGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user)
            return false;
        if (user.role && ['admin', 'hr'].includes(user.role))
            return true;
        const paramId = req.params?.['id'];
        if (user.role === 'employee' && paramId && user.employeeId === paramId)
            return true;
        return false;
    }
};
SelfOrRoleGuard = __decorate([
    (0, common_1.Injectable)()
], SelfOrRoleGuard);
exports.SelfOrRoleGuard = SelfOrRoleGuard;
//# sourceMappingURL=self-or-role.guard.js.map