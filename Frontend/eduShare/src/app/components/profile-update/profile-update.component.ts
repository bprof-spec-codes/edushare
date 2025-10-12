import { Component, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ProfileViewDto } from '../../dtos/profile-view-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileContent } from '../../models/file-content';
import { ImageDto } from '../../dtos/image-dto';
import { FileService } from '../../services/file.service';
import { UpdateProfileDto } from '../../dtos/update-profile-dto';

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

  constructor(private route:ActivatedRoute, private profileService: ProfileService,private fb: FormBuilder , private router: Router, private fileService:FileService) { 
    
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
        alert('Érvénytelen azonosító.')
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
          alert('Nem sikerült betölteni a profilt.')
        }
      })
    }
  }



  async onUpdate(value: UpdateProfileDto) {
 console.log(
  (this.profile?.firstname ?? '') +
  (this.profile?.lastname ?? '') +
  (this.profile?.email ?? '') +
  (this.profile?.image ? JSON.stringify(this.profile.image) : '')
);
  if (!this.profile|| !this.id) return;

  let imageDto = undefined;

  if (this.selectedFile && this.selectedFileDataUrl) {
    imageDto = {
      fileName: this.selectedFile.name,
      file: this.selectedFileDataUrl
    };
  } else if (this.profile.image) {
    imageDto = {
      fileName: this.profile.image.fileName,
      file: this.profile.image.file
    };
  }

  const dto: UpdateProfileDto = {
    email: value.email,
    firstname: value.firstname,
    lastname: value.lastname,
    image: this.selectedFileDataUrl
      ? { ...this.profile.image, file: this.selectedFileDataUrl } 
      : this.profile.image 
  };

  this.profileService.update(this.id, dto).subscribe({
    next: () => {
      alert('Profil sikeresen módosítva!');
      this.router.navigate(['/profile-view', this.id]);
    },
    error: (err) => {
      console.error('Hiba történt a módosítás során', err);
      alert('Nem sikerült módosítani a profilt.');
    }
  });
}

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const ext = file.name.split('.').pop()?.toLowerCase();



  if (!ext || !this.allowed.includes(ext)) {
    alert('Csak PNG és JPEG formátum engedélyezett!');
    input.value = '';
    this.selectedFileDataUrl = null;
    this.selectedFile = null;
    return;
  }
  this.selectedFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    this.selectedFileDataUrl = reader.result as string;
  };
  reader.readAsDataURL(file);

  this.updateForm.get('file')?.setValue(file);
}

getProfileImageSrc(): string {
  if (this.selectedFileDataUrl) return this.selectedFileDataUrl;
  const file = this.profile?.image?.file;
  if (!file) return 'assets/default-avatar.png';
  return file.startsWith('http') ? file : `data:image/*;base64,${file}`;
}

fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

}
