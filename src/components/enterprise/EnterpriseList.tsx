import styles from '@/app/admin/AdminPage.module.css';
import { api } from "@/lib/api";
import { EnterpriseSimpleData } from '@/types/enterprise';
import { useEffect, useState } from "react";
import { ActionButton } from '../ui/ActionButton';


interface Props {
  onRegister?: () => void;
  onBack?: () => void;
}

export function EnterpriseList( {onRegister, onBack} : Props) {
  const [enterprises, setEnterprises] = useState<EnterpriseSimpleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnterprises() {
      setLoading(true);
      try {
        const res = await api.get<EnterpriseSimpleData[]>('/enterprises/');
        setEnterprises(res.data);
      } catch {
        setError('Erro ao buscar empresas')
      } finally {
        setLoading(false)
      }
    }
    fetchEnterprises();
  }, []);


  if (loading) return <p>Carregando empresas...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!enterprises.length) return <p>Nenhuma empresa encontrada</p>;

  return (
    <div className={styles.enterpriseList}>
      <div className={styles.enterpriseListHeader}>
          <h2>Empresas Cadastradas</h2>
          <div className={styles.actions}>
            {onRegister && (
              <ActionButton onClick={onRegister} variant="primary">
                Cadastrar Empresa
              </ActionButton>
            )}
            {onBack && (
              <ActionButton onClick={onBack} variant="secondary">
                Votlar
              </ActionButton>
            )}
          </div>
      </div>
      <ul className={styles.enterpriseUl}>
        {enterprises.map(e => (
          <li key={e.id} className={styles.enterpriseItem}>
            <strong>{e.legalName}</strong> ({e.acronym})<br />
            <span>
              {e.cnpj} | {e.email} | {e.phone} | {e.city}/{e.state}
            </span>
          </li>
        ))}
    </ul>
    </div>
  );
}
