import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ClockService } from '../../services/clock.service';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    providers: [ClockService]
})
export class ClockComponent implements OnInit, OnDestroy {

    private _clockSubscription: Subscription;
    time: Date;

    constructor( private _clockService: ClockService ) { }

    ngOnInit() {
        this._clockSubscription = this._clockService.getClock().subscribe(time => this.time = time);
    }

    ngOnDestroy() {
        this._clockSubscription.unsubscribe();
    }
}
