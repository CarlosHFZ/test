'use client';

import adminStyles from '@/app/admin/AdminPage.module.css';
import { useCoats } from '@/hooks/pets/useCoats';
import { useCreateCoat } from '@/hooks/pets/useCreateCoat';
import { useCreatePet } from '@/hooks/pets/useCreatePet';
import { useCreateRace } from '@/hooks/pets/useCreateRace';
import { useCreateSpecie } from '@/hooks/pets/useCreateSpecie';
import { useRaces } from '@/hooks/pets/useRaces';
import { useSpecies } from '@/hooks/pets/useSpecies';
import { Colors } from '@/types/colors';
import { CreatePetDto, PetSex } from '@/types/pet';
import { PetGuardianSimpleData } from '@/types/pet-guardian';
import axios from 'axios';
import { PlusCircle, Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { GuardianFinderModal } from '../pet-guardian/GuardianFinderModal';
import { DateField } from '../ui/formFields/DateField';
import { SelectField, TextAreaField, TextField } from '../ui/formFields/formFields';
import { DraggableCreationPopup } from './DraggableCreationPopup'; // Importe o novo popup
import styles from './PetForm.module.css';


interface Props {
  initialData?: CreatePetDto;
  onSuccess(): void;
  onCancel(): void;
}

export function PetForm({ initialData, onSuccess, onCancel }: Props) {
  const [isGuardianModalOpen, setGuardianModalOpen] = useState(false);
  const [selectedGuardianName, setSelectedGuardianName] = useState<string | null>(null);

  const methods = useForm<CreatePetDto>({
    defaultValues: initialData
      ? initialData
      : ({ isActivate: true } as CreatePetDto),
  });

  const { handleSubmit, setValue, watch, control, formState: { isSubmitting } } = methods;

  const watchedSpeciesId = watch('speciesId');
   const numericSpeciesId = Number(watchedSpeciesId) || null;
  const createPet = useCreatePet();
  const createSpecie = useCreateSpecie();
  const createCoat = useCreateCoat();
  const createRace = useCreateRace();

  const { data: species = [], isLoading: isSpeciesLoading } = useSpecies();
  const { data: coats = [], isLoading: isCoatsLoading } = useCoats();

  const { data: races = [], isLoading: isRacesLoading } = useRaces(numericSpeciesId);

  const [popupConfig, setPopupConfig] = useState<{ type: 'species' | 'race' | 'coat', title: string } | null>(null);
  const handleGuardianSelect = useCallback((guardian: PetGuardianSimpleData) => {
    setValue('tutorId', guardian.id, { shouldValidate: true });
    setSelectedGuardianName(`${guardian.full_name || ''}`);
  }, [setValue]);

  async function handleFormSubmit(data: CreatePetDto) {
    try {
      const payload = {
        ...data,
        weight: data.weight ? parseFloat(String(data.weight)) : undefined,
        sterilization: String(data.sterilization) === 'true',
      };
      await createPet.mutateAsync(payload);
      toast.success('Pet cadastrado com sucesso!');
      onSuccess();
    } catch (err: unknown) {
      let errorMsg = 'Erro ao cadastrar pet.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const apiMessage = err.response.data.message;
        errorMsg = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;
      }
      toast.error(errorMsg);
      console.error(err);
    }
  }


  const handlePopupSubmit = async (data: { name: string }) => {
      if (!popupConfig) return;

      try {
        if (popupConfig.type === 'species') {
          await createSpecie.mutateAsync(data);
        } else if (popupConfig.type === 'coat') {
          await createCoat.mutateAsync(data);
        } else if (popupConfig.type === 'race') {
          if (!numericSpeciesId) {
            toast.error("Selecione uma espécie antes de criar uma raça.");
            return;
          }
          await createRace.mutateAsync({ name: data.name, species: numericSpeciesId });

        }
        setPopupConfig(null);
      } catch (error) {
        console.error(`Erro ao criar ${popupConfig.type}`, error);
      }
  };

  return (
    <FormProvider {...methods}>
    <form
      autoComplete="off"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 p-4"
    >
      {/* A variável 'error' foi removida, então este bloco não é mais necessário, a menos que você a reutilize */}
      {/* {error && (...) } */}

      {/* --- Seção: Identificação do Pet --- */}
      <div className="col-span-full">
        <h3 className={styles.sectionHeader}>Identificação do Pet</h3>
      </div>

      {/* Nome do Pet (ocupa 2 colunas) */}
      <div className="md:col-span-2 flex items-end">
        <TextField fullName="name" label="Nome do Pet" required className="flex-grow" />
      </div>

      {/* Tutor */}
      <div className="flex items-end">
        <div>
          <label className={styles.label}>Tutor *</label>
          <Controller
            name="tutorId"
            control={control}
            rules={{ required: "O tutor é obrigatório" }}
            render={({ fieldState: { error } }) => (
              <>
                <div className={styles.tutorSelector} onClick={() => setGuardianModalOpen(true)}>
                  <span>{selectedGuardianName || 'Clique para selecionar'}</span>
                  <Search size={18} />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </>
            )}
          />
        </div>
      </div>

      {/* --- Seção: Características --- */}
      <div className="col-span-full">
        <h3 className={styles.sectionHeader}>Características</h3>
      </div>

      {/* Espécie */}
      <div className="flex items-end gap-2">
        <SelectField name="speciesId" label="Espécie" options={species.map(s => ({ value: s.id, label: s.name }))} required className="flex-grow" disabled={isSpeciesLoading} />
        <button type="button" onClick={() => setPopupConfig({ type: 'species', title: 'Nova Espécie' })} className="p-2 flex-shrink-0" title="Criar nova espécie">
          <PlusCircle size={22} className="text-primary cursor-pointer" />
        </button>
      </div>

      {/* Raça */}
      <div className="flex items-end gap-2">
        <SelectField name="raceId" label="Raça" options={races.map(r => ({ value: r.id, label: r.name }))} required placeholder={!numericSpeciesId ? "Selecione a espécie" : "Selecione"} disabled={!numericSpeciesId || isRacesLoading} className="flex-grow" />
        <button type="button" onClick={() => setPopupConfig({ type: 'race', title: 'Nova Raça' })} disabled={!numericSpeciesId} className="p-2 flex-shrink-0" title="Criar nova raça">
          <PlusCircle size={22} className={`transition ${!numericSpeciesId ? 'text-gray-400' : 'text-primary cursor-pointer'}`} />
        </button>
      </div>

      {/* Pelagem */}
      <div className="flex items-end gap-2">
        <SelectField name="coatId" label="Pelagem" options={coats.map(c => ({ value: c.id, label: c.name }))} required className="flex-grow" disabled={isCoatsLoading} />
        <button type="button" onClick={() => setPopupConfig({ type: 'coat', title: 'Nova Pelagem' })} className="p-2 flex-shrink-0" title="Criar nova pelagem">
          <PlusCircle size={22} className="text-primary cursor-pointer" />
        </button>
      </div>

      {/* Sexo */}
      <div className="flex items-end">
        <SelectField name="sex" label="Sexo" options={Object.values(PetSex).map(s => ({ value: s, label: s }))} required placeholder="Selecione o Sexo" className="flex-grow" />
      </div>

      {/* Data de Nascimento */}
      <div className="flex items-end">
        <DateField name="birthDate" label="Data de Nascimento" className="flex-grow" />
      </div>

      <div /> {/* Div vazia para preencher o grid de 3 colunas */}

      {/* --- Seção: Informações Adicionais --- */}
      <div className="col-span-full">
        <h3 className={styles.sectionHeader}>Informações Adicionais</h3>
      </div>

      {/* Peso */}
      <div className="flex items-end">
        <TextField fullName="weight" label="Peso (kg)" type="number" step="0.01" className="flex-grow" />
      </div>

      {/* Castrado */}
      <div className="flex items-end">
        <SelectField name="sterilization" label="Castrado?" options={[{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]} placeholder="Não informado" className="flex-grow" />
      </div>

      {/* Nome da Tag */}
      <div className="flex items-end">
        <TextField fullName="tagName" label="Nome da Tag" type="text" className="flex-grow" />
      </div>

      {/* Cor da Tag */}
      <div className="md:col-span-3 flex items-end">
        <SelectField name="tagColor" label="Cor da Tag" options={Object.values(Colors).map(c => ({ value: c, label: c }))} placeholder="Nenhuma" className="flex-grow" />
      </div>

      {/* Observações */}
      <div className="md:col-span-full">
        {/* TextAreaField geralmente não precisa de alinhamento 'items-end' pois ocupa a célula toda */}
        <TextAreaField name="observation" label="Observações" />
      </div>

      {/* --- Ações --- */}
      <div className="col-span-full flex justify-end gap-2 mt-6 pt-4 border-t">
        <button type="button" onClick={onCancel} className={`${adminStyles.buttonSecondary} ${adminStyles.buttonLarge}`}>Voltar</button>
        <button type="submit" disabled={isSubmitting} className={`${adminStyles.buttonPrimary} ${adminStyles.buttonLarge}`}>
          {isSubmitting ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
      <DraggableCreationPopup
        isOpen={popupConfig !== null}
        onClose={() => setPopupConfig(null)}
        title={popupConfig?.title || ''}
        onSubmit={handlePopupSubmit}
        isLoading={createSpecie.isPending || createCoat.isPending || createRace.isPending}
      />
      <GuardianFinderModal
        isOpen={isGuardianModalOpen}
        onOpenChange={setGuardianModalOpen}
        onSelectGuardian={handleGuardianSelect}
      />
    </FormProvider>
  );
}

