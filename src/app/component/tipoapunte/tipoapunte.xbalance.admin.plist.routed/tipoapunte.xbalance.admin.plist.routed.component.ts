import { Component, inject, OnInit } from '@angular/core';
import { IApunte } from '../../../model/apunte.interface';
import { IPage } from '../../../model/model.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ISumas } from '../../../model/sumas.interface';
import { ITipoapunte } from '../../../model/tipoapunte.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { ApunteService } from '../../../service/apunte.service';
import { BotoneraService } from '../../../service/botonera.service';
import { TipoApunteService } from '../../../service/tipoapunte.service';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TipoApunteAdminSelectorUnroutedComponent } from '../tipoapunte.admin.selector.unrouted/tipoapunte.admin.selector.unrouted.component';

@Component({
  selector: 'app-tipoapunte.xbalance.admin.plist.routed',
  templateUrl: './tipoapunte.xbalance.admin.plist.routed.component.html',
  styleUrls: ['./tipoapunte.xbalance.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TipoapunteXBalanceAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<ITipoapunte> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  oTipoapunte: ITipoapunte = {} as ITipoapunte;
  private debounceSubject = new Subject<string>();
  oTotal: ISumas = {} as ISumas;
  id: number = 0;
  readonly dialog = inject(MatDialog);

  constructor(
    private oApunteService: ApunteService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oTipoapunteService: TipoApunteService
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.oTipoapunteService.getXBalance(params['id']).subscribe({
        next: (oTipoapunte: IPage<ITipoapunte>) => {
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });

      this.oActivatedRoute.params.subscribe((params) => {
        this.oApunteService.getTotalApuntesXTipoapunte(params['id']).subscribe({
          next: (oSuma: ISumas) => {
            this.oTotal = oSuma;
            console.log(this.oTotal);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
      });
    });
  }

  ngOnInit() {}

  getPage() {
    this.oTipoapunteService.getXBalance(this.id).subscribe({
      next: (oPage: IPage<ITipoapunte>) => {
        this.oPage = oPage;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  remove(oTipoapunte: ITipoapunte) {
    this.oTipoapunteService.deleteRelation(this.id, oTipoapunte.id).subscribe({
      next: () => {
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }

  showTipoApunteSelectorModal() {
    const dialogRef = this.dialog.open(
      TipoApunteAdminSelectorUnroutedComponent,
      {
        height: '800px',
        maxHeight: '1200px',
        width: '80%',
        maxWidth: '90%',
        data: { id: this.id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);}
        this.oTipoapunteService
          .addRelation(this.id, result.id)
          .subscribe({
            next: () => {
              this.getPage();
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },
          })
    });
    return false;
  }
}
