import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DateService } from 'src/app/date.service';
import { IMyDpOptions } from 'mydatepicker';
import { GlobalComponent } from 'src/app/global/global.component';
import { ClientHttpService } from '../client-parent.service';
import { ToastrService } from 'ngx-toastr';
import { EditDetailsClient } from '../client-parent.model';

@Component({
  selector: 'app-consumerassesment',
  templateUrl: './consumerassesment.component.html',
  styleUrls: ['./consumerassesment.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConsumerassesmentComponent implements OnInit {
  @Input() DataFromList: EditDetailsClient = new EditDetailsClient();
  @Output() EventToEdit = new EventEmitter<EditDetailsClient>();
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    // disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  cliList: any = {};
  genderList: [{ Key: number, Value: string }];
  dynamicdata:any={};
//   dynamicdata:any ={
//     "General_Info": {
//        "Firsr_Name": "",
//        "Middle_Name": "",
//        "Last_Name": "",
//        "DOB": "",
//        "Gender": "",
//        "Age": "",
//        "Medicare#": "",
//        "Medicaid#": ""
//     },
//     "Contact_Info": {
//        "Street": "",
//        "Apt": "",
//        "Email": "",
//        "Phone1": "",
//        "phone2": "",
//        "State": "",
//        "City": "",
//        "Country": "",
//        "Zip Code": ""
//     },
//     "Provider Info": {
//        "Name": "",
//        "Phone": "",
//        "street": "",
//        "Apt": "",
//        "City": "",
//        "State": "",
//        "Zip Code": "",
//        "Fax": "",
//        "Email": ""
//     },
//     "Provider's Contact Info": {
//        "Name": "",
//        "Phone 1": "",
//        "Phone 2": "",
//        "Email": "",
//        "Alt Name": "",
//        "State": "",
//        "Alt Phone": "",
//        "Alt Email": ""
//     },
//     "Can_client_direct_own_care": {
//        "menu": "Can client direct own care",
//        "value": [
//           {
//              "inputType": "radio",
//              "label": "Yes",
//              "value": ""
//           },
//           {
//              "inputType": "radio",
//              "label": "No",
//              "value": ""
//           }
//        ]
//     },
//     "Responsible_party_info": {
//        "menu": "Responsible party info",
//        "value": [
//           {
//              "submenu": "",
//              "value": [
//                 {
//                    "inputType": "text",
//                    "label": "Resp Party",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Relationship",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Address",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Phone",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "submenu": "In absense of Responsible Party",
//              "value": [
//                 {
//                    "inputType": "text",
//                    "label": "Delegate RP",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Relationship",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Address",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Phone",
//                    "value": ""
//                 }
//              ]
//           }
//        ]
//     },
//     "Things_that_may_impact_safety_and_vulnarability_of_the_individual": {
//        "menu": "Things that may impact safety and vulnarability of the individual",
//        "value": [
//           {
//              "submenu": "Legal",
//              "value": "",
//              "subvalue": [
//                 {
//                    "inputType": "radio",
//                    "label": "Yes",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "radio",
//                    "label": "No",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "textarea",
//                    "label": "If Yes, explain",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "submenu": "Physical",
//              "value": "",
//              "subvalue": [
//                 {
//                    "inputType": "radio",
//                    "label": "Yes",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "radio",
//                    "label": "No",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "textarea",
//                    "label": "If Yes, explain",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "submenu": "Environmental",
//              "value": "",
//              "subvalue": [
//                 {
//                    "inputType": "radio",
//                    "label": "Yes",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "radio",
//                    "label": "No",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "textarea",
//                    "label": "If Yes, explain",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "submenu": "Other",
//              "value": "",
//              "subvalue": [
//                 {
//                    "inputType": "radio",
//                    "label": "Yes",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "radio",
//                    "label": "No",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "textarea",
//                    "label": "If Yes, explain",
//                    "value": ""
//                 }
//              ]
//           }
//        ]
//     },
//     "Medications_and_doses": {
//        "menu": "Medications and doses",
//        "value": [
//           {
//              "menu": [
//                 "Doses",
//                 "Frequency",
//                 "Route"
//              ],
//              "value": [
//                 {
//                    "menu": "",
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 }
//              ]
//           },
//           {
//              "menu": "",
//              "value": [
//                 {
//                    "menu": "Emergency number posted at house?",
//                    "subvalues": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "textarea",
//                    "label": "Notes",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "menu": "",
//              "value": {
//                 "menu": "",
//                 "subvalues": "",
//                 "inputType": "textarea",
//                 "label": "Allergies",
//                 "value": ""
//              }
//           },
//           {
//              "menu": "",
//              "value": [
//                 {
//                    "menu": "Waiver?",
//                    "subvalues": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "checkbox",
//                    "label": "MR/RC",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "checkbox",
//                    "label": "CADI",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "checkbox",
//                    "label": "EW",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "checkbox",
//                    "label": "ACS",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "checkbox",
//                    "label": "CAC",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "checkbox",
//                    "label": "TBI",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "menu": "",
//              "value": [
//                 {
//                    "menu": "Health Insurance?",
//                    "subvalues": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "textarea",
//                    "label": "Company Name",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "textarea",
//                    "label": "Policy #",
//                    "value": ""
//                 },
//                 {
//                    "menu": "",
//                    "subvalues": "",
//                    "inputType": "textarea",
//                    "label": "Group #",
//                    "value": ""
//                 }
//              ]
//           }
//        ]
//     },
//     "Contact_persons_info": {
//        "menu": "Contact person's info",
//        "value": [
//           {
//              "menu": [
//                 "Case Manager/PHN",
//                 "County",
//                 "Address",
//                 "Telephone"
//              ],
//              "value": [
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "menu": [
//                 "Physician",
//                 "Address",
//                 "Telephone",
//                 "Hospital of choice"
//              ],
//              "value": [
//                 {
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 }
//              ]
//           },
//           {
//              "menu": [
//                 "Emergency Contact",
//                 "Relationship",
//                 "Address",
//                 "Telephone"
//              ],
//              "value": [
//                 {
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "subvalues": [
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "text",
//                          "label": "",
//                          "value": ""
//                       }
//                    ]
//                 }
//              ]
//           },
//           {
//              "menu": "",
//              "value": [
//                 {
//                    "inputType": "",
//                    "label": "",
//                    "menu": "Emergency number posted at house?",
//                    "value": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": ""
//                       }
//                    ]
//                 }
//              ]
//           },
//           {
//              "menu": "",
//              "value": [
//                 {
//                    "inputType": "",
//                    "label": "",
//                    "menu": "Does client attend school, day program or work?",
//                    "value": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": ""
//                       }
//                    ]
//                 }
//              ]
//           },
//           {
//              "menu": [
//                 "If Yes, program attended",
//                 "Days of week",
//                 "Hours",
//                 "Notes"
//              ],
//              "value": [
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "",
//                    "subvalues": "",
//                    "value": ""
//                 }
//              ]
//           }
//        ]
//     },
//     "Sensory_Status": {
//        "menu": "I.Sensory Status",
//        "heading1": "A. Communications :",
//        "heading2": "Comments/Instructions :",
//        "value": [
//           {
//              "menu": "LANGUAGE",
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "No impairment",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Minimal impairment with expression of basic needs/feelings",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Unable to express basic needs, but is responsive",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Unresponsive, unable to speak",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Age appropriate",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comments": {
//                 "inputType": "textarea",
//                 "label": "comment",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": "HEARING",
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "No impairment",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Minimal to severe impairments",
//                    "value": "",
//                    "submenu": {
//                       "menu": "Hearing aids?",
//                       "value": [
//                          {
//                             "inputType": "radio",
//                             "label": "Yes",
//                             "value": ""
//                          },
//                          {
//                             "inputType": "radio",
//                             "label": "No",
//                             "value": ""
//                          }
//                       ]
//                    }
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Unable to hear",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comments": {
//                 "inputType": "textarea",
//                 "label": "comment",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": "VISION",
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Normal vision",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Impaired vision",
//                    "value": "",
//                    "submenu": {
//                       "menu": "Glasses?",
//                       "value": [
//                          {
//                             "inputType": "radio",
//                             "label": "Yes",
//                             "value": ""
//                          },
//                          {
//                             "inputType": "radio",
//                             "label": "No",
//                             "value": ""
//                          }
//                       ]
//                    }
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "No useful vision",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comments": {
//                 "inputType": "textarea",
//                 "label": "comment",
//                 "value": "",
//                 "submenu": ""
//              }
//           }
//        ]
//     },
//     "Activity_of_daily_living": {
//        "menu": "II. Activities of daily living",
//        "value": [
//           {
//              "menu": [
//                 "A. Dressing :",
//                 "Comments/Instructions :"
//              ],
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Independent",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Remainders",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": " Supervision of another person",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Dependent of another person",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "Comments/Instructions :",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": [
//                 "B. Grooming :",
//                 "Comments/Instructions :"
//              ],
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Independent",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Remainders",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": " Supervision of another person",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Dependent of another person",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "Comments/Instructions :",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": "",
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Hair care",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Tooth brushing",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Shaving",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Other :",
//                    "value": "",
//                    "submenu": {
//                       "inputType": "text",
//                       "label": "",
//                       "value": ""
//                    }
//                 }
//              ],
//              "comment": ""
//           },
//           {
//              "menu": [
//                 "C. Bathing :",
//                 "Comments/Instructions :"
//              ],
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Independent",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Remainders",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": " Supervision of another person",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Dependent of another person",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "",
//                    "label": "",
//                    "submenu": "type",
//                    "value": [
//                       {
//                          "inputType": "checkbox",
//                          "label": "Shower",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "checkbox",
//                          "label": "Tub",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "inputType": "",
//                    "label": "",
//                    "submenu": "Frequency :",
//                    "value": [
//                       {
//                          "inputType": "checkbox",
//                          "label": "Daily",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "checkbox",
//                          "label": "Other : 3 times per week",
//                          "value": ""
//                       }
//                    ]
//                 }
//              ],
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "Comments/Instructions :",
//                 "value": "",
//                 "submenu": ""
//              }
//           }
//        ]
//     },
//     "Complex_medical_needs": {
//        "menu": "III. Complex medical needs",
//        "value": [
//           {
//              "menu": "A. Tube feelings(Nasogastic,Gastrostomy) :",
//              "menu2": "Comments/Instructions :",
//              "value": [
//                 {
//                    "inputType": "text",
//                    "label": "Supplement :",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Amount :",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": " Frequency :",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comment": {
//                 "inputType": "",
//                 "label": "",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": "",
//              "menu2": "",
//              "value": [
//                 {
//                    "inputType": "",
//                    "label": "",
//                    "submenu": "Skin Care?",
//                    "value": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": "",
//                          "submenu": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": "",
//                          "submenu": ""
//                       }
//                    ]
//                 }
//              ],
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": "",
//              "menu2": "",
//              "value": [
//                 {
//                    "inputType": "",
//                    "label": "",
//                    "submenu": "Respiratory Assistance?",
//                    "value": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": ""
//                       }
//                    ]
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Type(Nebulizer,bronchial drainage,oxygen etc.. ) :",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Frequency :",
//                    "value": "",
//                    "submenu": ""
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Directions :",
//                    "value": "",
//                    "submenu": ""
//                 }
//              ],
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "",
//                 "value": "",
//                 "submenu": ""
//              }
//           }
//        ]
//     },
//     "Seizures": {
//        "menu": "IV. Seizures",
//        "value": {
//           "menu1": "A. Seizures :",
//           "value": [
//              {
//                 "inputType": "checkbox",
//                 "label": "No history of seizures  :",
//                 "value": "",
//                 "submenu": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "History of seizures ",
//                 "value": "",
//                 "submenu": ""
//              }
//           ],
//           "menu2": "Comments/Instructions :",
//           "value2": [
//              {
//                 "inputType": "text",
//                 "label": "Date of last seizure :",
//                 "value": "",
//                 "submenu": ""
//              },
//              {
//                 "inputType": "text",
//                 "label": "Types(s) :",
//                 "value": "",
//                 "submenu": ""
//              },
//              {
//                 "inputType": "text",
//                 "label": "Frequency :",
//                 "value": "",
//                 "submenu": ""
//              },
//              {
//                 "inputType": "text",
//                 "label": "Duration :",
//                 "value": "",
//                 "submenu": ""
//              }
//           ]
//        }
//     },
//     "behaviour": {
//        "menu": "V. Behaviours",
//        "value": {
//           "menu1": "A. Behaviours :",
//           "value": [
//              {
//                 "menu": "Level I",
//                 "value": [
//                    {
//                       "inputType": "checkbox",
//                       "label": "Self injuries",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Physical injury to others",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Destruction of property",
//                       "value": "",
//                       "submenu": ""
//                    }
//                 ]
//              },
//              {
//                 "menu": "Level II",
//                 "value": [
//                    {
//                       "inputType": "checkbox",
//                       "label": "Unusual / repetitive habits",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Withdrawal",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Socially offensive",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Other : Stealing",
//                       "value": "",
//                       "submenu": ""
//                    }
//                 ]
//              },
//              {
//                 "menu": "Level III",
//                 "value": [
//                    {
//                       "inputType": "checkbox",
//                       "label": "Requires no prompts/ assists to initiate or complete tasks",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Need prompts/ assists to initiate or complete tasks",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Need intermittent prompts/ assists during tasks",
//                       "value": "",
//                       "submenu": ""
//                    },
//                    {
//                       "inputType": "checkbox",
//                       "label": "Need on-going prompts/ assists during tasks",
//                       "value": "",
//                       "submenu": ""
//                    }
//                 ]
//              }
//           ],
//           "menu2": "Comments/Instructions :",
//           "value2": {
//              "inputType": "textare",
//              "label": "",
//              "value": "",
//              "submenu": ""
//           }
//        }
//     },
//     "Supportive_activities_of_daily_living": {
//        "menu": "II. Activities of daily living",
//        "value": [
//           {
//              "menu": "A. Dressing :",
//              "value": [
//                 {
//                    "menu": "Appointment Management :",
//                    "value": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": "",
//                          "submenu": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": "",
//                          "submenu": ""
//                       }
//                    ]
//                 },
//                 {
//                    "menu": "Accompany to appointments :",
//                    "value": [
//                       {
//                          "inputType": "radio",
//                          "label": "Yes",
//                          "value": "",
//                          "menu": ""
//                       },
//                       {
//                          "inputType": "radio",
//                          "label": "No",
//                          "value": "",
//                          "menu": ""
//                       }
//                    ]
//                 }
//              ],
//              "menu2": "Comments/Instructions :",
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "Comments/Instructions :",
//                 "value": "",
//                 "submenu": ""
//              }
//           },
//           {
//              "menu": "B. Home Management:",
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Laundry",
//                    "value": "",
//                    "menu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "House keeping/Cleaning",
//                    "value": "",
//                    "menu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Meal prep/Cooking",
//                    "value": "",
//                    "menu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Shopping/Errands(Group)",
//                    "value": "",
//                    "menu": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Other : Clean room-sweeping",
//                    "value": "",
//                    "menu": ""
//                 }
//              ],
//              "menu2": "Comments/Instructions :",
//              "comment": {
//                 "inputType": "textarea",
//                 "label": "Comments/Instructions :",
//                 "value": "",
//                 "menu": ""
//              }
//           }
//        ]
//     },
//     "communication": {
//        "menu": "VII. Communications",
//        "values": {
//           "menu": "A. Communications :",
//           "values": [
//              {
//                 "inputType": "checkbox",
//                 "label": "Check with client/caregiver regarding special requests",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Notify supervisor of requests",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Notify supervisor if client has any changes in these conditions:  ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Discoloration ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Swelling ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Bruises ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Increased pain  ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Decreased appetite  ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Decreased mobility  ",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "No answer to locked door",
//                 "value": ""
//              },
//              {
//                 "inputType": "checkbox",
//                 "label": "Client refuses personal care",
//                 "value": ""
//              }
//           ],
//           "menu2": "Comments/Instructions :",
//           "values1": {
//              "inputType": "textarea",
//              "label": "comment",
//              "value": ""
//           }
//        }
//     },
//     "staffing": {
//        "menu": "VIII. Staffing",
//        "value": {
//           "inputType": "date",
//           "label": "Service begins :",
//           "value": ""
//        }
//     },
//     "Expected_outcomes_goals": {
//        "menu": "Expected outcomes/goals",
//        "value": [
//           {
//              "menu": "Plan of care developed in consulation with :",
//              "value": [
//                 {
//                    "inputType": "checkbox",
//                    "label": "Client",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Family/Significant",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "checkbox",
//                    "label": "Family/Significant",
//                    "value": " "
//                 },
//                 {
//                    "inputType": "text",
//                    "label": "Other :",
//                    "value": ""
//                 }
//              ]
//           },
//           {
//              "value": [
//                 {
//                    "inputType": "date",
//                    "label": "Start date",
//                    "value": ""
//                 },
//                 {
//                    "inputType": "date",
//                    "label": "End date",
//                    "value": ""
//                 }
//              ]
//           }
//        ]
//     },
//     "PLAN_OF_CARE_REVIEW_UPDATE_MINIMALLY_ANNUALLY": {
//        "menu": "PLAN OF CARE REVIEW UPDATE (MINIMALLY ANNUALLY)",
//        "value": [
//           {
//              "inputType": "text",
//              "label": "Responsible party sign",
//              "value": ""
//           },
//           {
//              "inputType": "date",
//              "label": "Date",
//              "value": ""
//           },
//           {
//              "inputType": "text",
//              "label": "Nurse sign",
//              "value": ""
//           },
//           {
//              "inputType": "date",
//              "label": "Date",
//              "value": ""
//           }
//        ]
//     }
//  }
  constructor(public dateservice: DateService,public global: GlobalComponent,public ClientService: ClientHttpService,private ref: ChangeDetectorRef,
   public toastrService: ToastrService) 
  {

   // ref.detach();
   // setInterval(() => {
   //   this.ref.detectChanges();
   // }, 10);

   }

  ngOnInit(): void {
   this.ClientService.getConsumer().subscribe(data => {
      console.log(data);
      this.dynamicdata=data[0];
  });
    this.getGender();
  }
  newdates(event, types, value) {
   //console.log(value)
    if (types == "inputchage") {

      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
       //console.log(val1)
        value.value = val1;
       //console.log(value.value)
      }
    }
    if (types == "datechagned") {
      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
       //console.log(val1)
        value.value = val1;
       //console.log(value.value)
      }
    }
  }
  radiovaluchange(e, val, i) {
   //console.log(val);
   //console.log(e);
   //console.log(i);
    if (i == 0) {
      val[i].value = "Yes";
      val[i + 1].value = "";
    }
    if (i == 1) {
      val[i].value = "No";
      val[i - 1].value = "";
    }
  }
  toggleVisibility(e) {
   //console.log(e);

   //console.log(e.target.value);


    // e.target.id
    return e.target.checked
  }
  newfunc(e, v, val) {
   //console.log(val);

   //console.log(e);
   //console.log(v);
    return val
  }
  getGender() {
    let params = new URLSearchParams();
    params.append("Code", "GENDER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.ClientService.getLOV(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.genderList = data;
    })
  }
  succCliAdd(status){
    this.toastrService.show(
      'Client has been rejected',
      'Client Rejection',
      ),3000;
    }
    succAdd(status){
    //console.log( this.dynamicdata);
      this.toastrService.show(
        'Careplan assessment has been saved',
        'Careplan assessment',
        ),3000;
      }
      clickchange(event)
      {
       //console.log(event);
       //console.log(event.target.classList)
        let val1=event.target.classList
       //console.log(val1)
       let val3= document.getElementById("id2");
      //console.log();
       
       console.log(val3.classList)
        let val=val3.className
       console.log(val);
        if(val.includes("fa-chevron-up"))
        {
          val3.classList.add(" fa-chevron-down")
          val3.classList.remove(" fa-chevron-up")
        

        }
        if(val.includes("fa-chevron-down"))
        {
          val3.classList.add("fa-chevron-up")
          val3.classList.remove("fa-chevron-down")
          
        }
      }

      back()
      {
        this.DataFromList.isEdit = true;
        this.DataFromList.isView = false;
        this.DataFromList.iscounsumer=false;
        this.EventToEdit.emit(this.DataFromList)
        this.global.globalICD10List=[];
      }
}
