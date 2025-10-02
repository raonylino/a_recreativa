import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

interface ErrorDisplayProps {
  title?: string;
  subTitle?: string;
  showBackButton?: boolean;
}

export default function ErrorDisplay({
  title = 'Ops! Algo deu errado',
  subTitle = 'Desculpe, ocorreu um erro ao carregar os dados.',
  showBackButton = true
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <Result
      status="500"
      title={title}
      subTitle={subTitle}
      extra={
        showBackButton && (
          <Button type="primary" onClick={() => router.push('/')}>
            Voltar para Início
          </Button>
        )
      }
    />
  );
}
