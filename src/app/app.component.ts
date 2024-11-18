import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  categoriaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoriaForm = this.fb.group({
      arrayCaixas: this.fb.array([]),
    });
  }

  createCaixa(): FormGroup {
    return this.fb.group({
      arquivos: this.fb.array([this.createFileInput()]),
    });
  }

  createFileInput() {
    return this.fb.control(null, Validators.required);
  }

  get variacoes(): FormArray {
    return this.categoriaForm.get('arrayCaixas') as FormArray;
  }

  getArquivosControls(index: number): FormArray {
    return (this.variacoes.at(index).get('arquivos') as FormArray);
  }

  addCaixa(): void {
    this.variacoes.push(this.createCaixa());
  }

  addFileInput(index: number): void {
    const arquivos = this.variacoes.at(index).get('arquivos') as FormArray;
    arquivos.push(this.createFileInput());
  }

  removeCaixa(index: number): void {
    this.variacoes.removeAt(index);
  }

  removerArquivo(index: number, fileIndex: number): void {
    const arquivos = this.getArquivosControls(index);
    arquivos.removeAt(fileIndex);
  }

  onFileSelected(event: Event, index: number, fileIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const variacao = this.variacoes.at(index);
      const arquivos = variacao.get('arquivos') as FormArray;
      arquivos.at(fileIndex).setValue(file.name);
    }
  }

  uploadAllFiles(): void {
    let uploadedCount = 0;
    this.variacoes.controls.forEach((caixa, caixaIndex) => {
      const arquivos = (caixa.get('arquivos') as FormArray).controls;
      arquivos.forEach((arquivoControl, arquivoIndex) => {
        const fileName = arquivoControl.value;
        if (fileName) {
          this.simulateFileUpload(fileName, caixaIndex, arquivoIndex);
          uploadedCount++;
        }
      });
    });

    // Exibe o alerta de sucesso após todos os uploads
    if (uploadedCount > 0) {
      alert('Todos os arquivos foram enviados com sucesso!');
    }
  }

  simulateFileUpload(fileName: string, caixaIndex: number, arquivoIndex: number): void {
    console.log(`Enviando arquivo ${fileName} da Caixa ${caixaIndex + 1}, Arquivo ${arquivoIndex + 1}`);
    setTimeout(() => {
      console.log(`Arquivo ${fileName} enviado com sucesso!`);
    }, 2000); // Simula o tempo de upload
  }
}

