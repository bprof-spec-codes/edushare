import { Component, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileContent } from '../../models/file-content';
import { ImageDto } from '../../dtos/image-dto';
import { FileService } from '../../services/file.service';
import { UpdateProfileDto } from '../../dtos/update-profile-dto';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile-update',
  standalone: false,
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.sass'
})
export class ProfileUpdateComponent {
  @Input() isUpdateMode = false

  profile:UpdateProfileDto|null=null
  updateForm!: FormGroup
  content?: ImageDto
    fileError = ''
  allowed = ['png','jpg', 'jpeg']
  id!: string
  selectedFile: File | null = null;
  selectedFileDataUrl: string | null = null;

  constructor(private route:ActivatedRoute, private profileService: ProfileService,private fb: FormBuilder , private router: Router, private fileService:FileService, private toast: ToastService) { 
    
  }
  ngOnInit(){
    this.updateForm = this.fb.group(
      { 
        email: [this.profile?.email ?? '', [Validators.required, Validators.email]],
        lastname: [this.profile?.lastname ?? '', Validators.required],
        firstname: [this.profile?.firstname ?? '', Validators.required],
        file: [null]
      }
    )

    const id = this.route.snapshot.paramMap.get('id')
      if(!id) {
        this.toast.show('Érvénytelen azonosító.');
        return
      }
      this.id = id;


      if (id) {
      this.profileService.getById(id).subscribe({
        next: (data) => {
    this.profile = {
      email: data.email,
      firstname: data.fullName.split(' ')[1] ?? '',
      lastname: data.fullName.split(' ')[0] ?? '',
      image: data.image
    } as UpdateProfileDto;
     this.updateForm.patchValue({
      email: this.profile.email,
          firstname: this.profile.firstname,
          lastname: this.profile.lastname
          
        });
  },
  
        error: (err) => {
          console.error(err)
          this.toast.show('Nem sikerült betölteni a profilt.');
        }
      })
    }
  }



onUpdate() {
  const value = this.updateForm.value;
  if (!this.profile|| !this.id) return;

  const imageDto: ImageDto | undefined = this.selectedFileDataUrl
    ? {
        id: this.profile?.image?.id ?? '', // ha van korábbi kép
        fileName: this.selectedFile?.name ?? 'profile.png',
        file: this.selectedFileDataUrl
      }
    : this.profile?.image;

  const dto: UpdateProfileDto = {
    email: value.email,
    firstname: value.firstname,
    lastname: value.lastname,
    image: this.selectedFileDataUrl
      ? {
          id: this.profile?.image?.id ?? '',
          fileName: this.selectedFile?.name ?? 'profile.png',
          file: this.selectedFileDataUrl
        }
      : this.profile?.image
  };


  this.profileService.update(this.id, dto).subscribe({
    next: () => {
      this.toast.show('Profil sikeresen módosítva!');
      this.router.navigate(['/profile-view', this.id]);
    },
    error: (err) => {
      console.error('Hiba történt a módosítás során', err);
      this.toast.show('Nem sikerült módosítani a profilt.');
    }
  });
}

async onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (!ext || !this.allowed.includes(ext)) {
    this.toast.show('Csak PNG és JPEG formátum engedélyezett!');
    input.value = '';
    this.selectedFileDataUrl = null;
    this.content = undefined;
    return;
  }
   if (file.name.length > 50) {
    this.toast.show('A fájlnév túl hosszú! Maximum 50 karakter engedélyezett.');
    input.value = '';
    this.selectedFileDataUrl = null;
    this.content = undefined;
    return;
  }
  this.selectedFile = file;
  const fileContent = await this.fileService.toFileContent(file);
  this.selectedFileDataUrl = fileContent.file;

    this.content = {
      id: this.profile?.image?.id ?? '',
      fileName: fileContent.fileName,
      file: fileContent.file 
    };

    this.updateForm.get('file')?.setValue(file);
}

getProfileImageSrc(): string {
  const file =this.content?.file || this.profile?.image?.file;
  if (!file) return 'assets/default-avatar.png';
  return file.startsWith('http') ? file : `data:image/*;base64,${file}`;
}

}