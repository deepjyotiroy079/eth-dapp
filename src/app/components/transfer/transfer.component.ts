import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
  providers: [TransferService]
})
export class TransferComponent implements OnInit {

  formSubmitted = false;
  userForm: FormGroup;
  user;

  accountValidationMessages = {
    transferAddress: [
      { type: 'required', message: 'Transfer Address is required' },
      { type: 'minLength', message: 'Transfer Address must be 42 characters long' },
      { type: 'maxLength', message: 'Transfer Address must be 42 characters long' }
    ],
    amount: [
      { type: 'required', message: 'Amount is required' },
      { type: 'pattern', message: 'Amount must be a positive number' }
    ],
    remarks: [
      { type: 'required', message: 'Remarks are required' }
    ]
  };

  constructor(private fb: FormBuilder, private transferService: TransferService) { }

  ngOnInit(): void {
    this.formSubmitted = false;
    this.user = { address: '', transferAddress: '', balance: '', amount: '', remarks: '' };
    this.getAccountAndBalance();
    this.createForms();
  }
  
  getAccountAndBalance() {
    this.transferService.getUserBalance().then(function(retAccount:any){
      this.user.address = retAccount.address;
      this.user.balance = retAccount.balance;
      console.log('transfer.component :: getAccountAndBalance :: this.user');
      console.log("Address : "+ this.user.address);
    }).catch(function(error){
      console.log(error);
    });
  }
  createForms() {
    this.userForm = this.fb.group({
      transferAddress: new FormControl(this.user.transferAddress, Validators.compose([
        Validators.required,
        Validators.minLength(42),
        Validators.maxLength(42)
      ])),
      amount: new FormControl(this.user.amount, Validators.compose([
        Validators.required,
        Validators.pattern('^[+]?([.]\\d+|\\d+[.]?\\d*)$')
      ])),
      remarks: new FormControl(this.user.remarks, Validators.compose([
        Validators.required
      ]))
    });

    
  }
  submitForm() {
    if (this.userForm.invalid) {
      alert('transfer.components :: submitForm :: Form invalid');
      return;
    } else {
      console.log('transfer.components :: submitForm :: this.userForm.value');
      console.log(this.userForm.value);
      // TODO: service call
      this.transferService.transferEther(this.userForm.value).
      then(function() {}).catch(function(error) {
        console.log(error);
      });
    }
  }

}
