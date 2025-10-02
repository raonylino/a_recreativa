'use client';

import { Document, DocumentStatus, documentService } from '@/services/api';
import { DownloadOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import type { TableColumnsType, UploadProps } from 'antd';
import { Button, Card, Divider, Layout, Space, Table, Tag, Typography, Upload, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

dayjs.locale('pt-br');

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Carregar documentos ao montar
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.list();
      setDocuments(data);
    } catch (error) {
      message.error('Erro ao carregar documentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.pdf,.doc,.docx',
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        const uploadedDoc = await documentService.upload(file as File);
        message.success(`${uploadedDoc.originalFileName} enviado com sucesso!`);
        onSuccess?.(uploadedDoc);
        loadDocuments(); // Recarregar lista
      } catch (error) {
        message.error('Erro ao enviar arquivo');
        onError?.(error as Error);
      } finally {
        setUploading(false);
      }
    },
  };

  const getStatusTag = (status: DocumentStatus) => {
    const statusConfig: Record<DocumentStatus, { color: string; text: string }> = {
      [DocumentStatus.UPLOADED]: { color: 'blue', text: 'Enviado' },
      [DocumentStatus.PROCESSING]: { color: 'orange', text: 'Processando' },
      [DocumentStatus.STRUCTURED]: { color: 'purple', text: 'Estruturado' },
      [DocumentStatus.STANDARDIZED]: { color: 'green', text: 'Padronizado' },
      [DocumentStatus.ERROR]: { color: 'red', text: 'Erro' },
    };

    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: TableColumnsType<Document> = [
    {
      title: 'Arquivo',
      dataIndex: 'originalFileName',
      key: 'originalFileName',
      render: (text: string, record: Document) => (
        <Space>
          {record.originalMimeType.includes('pdf') ? <FilePdfOutlined /> : <FileTextOutlined />}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DocumentStatus) => getStatusTag(status),
      filters: [
        { text: 'Enviado', value: DocumentStatus.UPLOADED },
        { text: 'Estruturado', value: DocumentStatus.STRUCTURED },
        { text: 'Padronizado', value: DocumentStatus.STANDARDIZED },
      ],
      onFilter: (value: any, record: { status: any; }) => record.status === value,
    },
    {
      title: 'Data de Upload',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: { createdAt: any; }, b: { createdAt: any; }) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Tamanho',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/documents/${record.id}`)}
          >
            Visualizar
          </Button>
          {record.status === DocumentStatus.UPLOADED && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/documents/${record.id}/edit`)}
            >
              Estruturar
            </Button>
          )}
          {record.status === DocumentStatus.STANDARDIZED && record.standardizedFilePath && (
            <Button
              type="default"
              icon={<DownloadOutlined />}
              href={documentService.downloadStandardized(record.id)}
              target="_blank"
            >
              PDF
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          📚 Gestão de Planos de Aula
        </Title>
      </Header>

      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Card de Upload */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Enviar Novo Plano de Aula</Title>
            <Paragraph type="secondary">
              Faça upload de seus planos de aula em PDF ou Word (.docx) para organizá-los e padronizá-los.
            </Paragraph>
            <Upload {...uploadProps}>
              <Button
                icon={<UploadOutlined />}
                size="large"
                type="primary"
                loading={uploading}
              >
                {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
              </Button>
            </Upload>
          </Card>

          <Divider />

          {/* Tabela de Documentos */}
          <Card>
            <Title level={4} style={{ marginBottom: 16 }}>
              Documentos ({documents.length})
            </Title>
            <Table
              columns={columns}
              dataSource={documents}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total: any) => `Total de ${total} documentos`,
              }}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
