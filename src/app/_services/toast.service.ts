import { ToastrService } from 'ngx-toastr';
import { ToasterPosition } from '../_models/toaster-enum.position';
import { Injectable } from '@angular/core';

@Injectable()
export class ToasterService {
    constructor(private toastr: ToastrService) {}

    public show(title: string, message: string, positionClass: ToasterPosition) {
        this.toastr.show(message, title, { positionClass });
    }

    public success(title: string, message: string, positionClass: ToasterPosition) {
        this.toastr.success(message, title, { positionClass });
    }

    public error(title: string, message: string, positionClass: ToasterPosition) {
        this.toastr.error(message, title, { positionClass });
    }
}
