import { Spin } from 'antd';

interface LoadingProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
}

export default function Loading({ tip = 'Carregando...', size = 'large' }: LoadingProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      width: '100%'
    }}>
      <Spin size={size} tip={tip} />
    </div>
  );
}
