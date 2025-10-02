'use client';

import { Document, documentService, DocumentStatus } from '@/services/api';
import { ArrowLeftOutlined, DownloadOutlined, EditOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Layout, message, Space, Spin, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export default function ViewDocument() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentService.getById(id);
      setDocument(data);
    } catch (error) {
      message.error('Erro ao carregar documento');
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" tip="Carregando documento..." />
        </Content>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: 24 }}>
          <Card>
            <Title level={4}>Documento não encontrado</Title>
            <Button onClick={() => router.push('/')}>Voltar</Button>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/')}>
            Voltar
          </Button>
          <Title level={4} style={{ margin: 0 }}>Visualizar Documento</Title>
        </Space>
      </Header>

      <Content style={{ padding: 24, background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Informações Gerais */}
            <Card>
              <Title level={4}>Informações do Documento</Title>
              <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                <Descriptions.Item label="Nome do Arquivo">
                  <Space>
                    {document.originalMimeType.includes('pdf') ? <FilePdfOutlined /> : <FileTextOutlined />}
                    {document.originalFileName}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {getStatusTag(document.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Upload">
                  {dayjs(document.createdAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Tamanho">
                  {(document.fileSize / 1024).toFixed(2)} KB
                </Descriptions.Item>
                <Descriptions.Item label="Tipo">
                  {document.originalMimeType}
                </Descriptions.Item>
                {document.standardizedGeneratedAt && (
                  <Descriptions.Item label="PDF Gerado em">
                    {dayjs(document.standardizedGeneratedAt).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Divider />

              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  href={documentService.downloadOriginal(id)}
                  target="_blank"
                >
                  Download Original
                </Button>
                {document.status === DocumentStatus.UPLOADED && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/documents/${id}/edit`)}
                  >
                    Estruturar Dados
                  </Button>
                )}
                {document.standardizedFilePath && (
                  <Button
                    type="primary"
                    icon={<FilePdfOutlined />}
                    href={documentService.downloadStandardized(id)}
                    target="_blank"
                  >
                    Download PDF Padronizado
                  </Button>
                )}
              </Space>
            </Card>

            {/* Dados Estruturados */}
            {document.structuredData && (
              <Card>
                <Title level={4}>Dados Estruturados</Title>
                <Descriptions bordered column={1}>
                  {document.structuredData.title && (
                    <Descriptions.Item label="Título">
                      {document.structuredData.title}
                    </Descriptions.Item>
                  )}
                  {document.structuredData.subject && (
                    <Descriptions.Item label="Disciplina">
                      {document.structuredData.subject}
                    </Descriptions.Item>
                  )}
                  {document.structuredData.grade && (
                    <Descriptions.Item label="Série/Ano">
                      {document.structuredData.grade}
                    </Descriptions.Item>
                  )}
                  {document.structuredData.duration && (
                    <Descriptions.Item label="Duração">
                      {document.structuredData.duration}
                    </Descriptions.Item>
                  )}
                  {document.structuredData.objectives && document.structuredData.objectives.length > 0 && (
                    <Descriptions.Item label="Objetivos">
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {document.structuredData.objectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </Descriptions.Item>
                  )}
                  {document.structuredData.content && document.structuredData.content.length > 0 && (
                    <Descriptions.Item label="Conteúdo">
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {document.structuredData.content.map((cnt, idx) => (
                          <li key={idx}>{cnt}</li>
                        ))}
                      </ul>
                    </Descriptions.Item>
                  )}
                  {document.structuredData.methodology && (
                    <Descriptions.Item label="Metodologia">
                      <Paragraph>{document.structuredData.methodology}</Paragraph>
                    </Descriptions.Item>
                  )}
                  {document.structuredData.resources && document.structuredData.resources.length > 0 && (
                    <Descriptions.Item label="Recursos">
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {document.structuredData.resources.map((res, idx) => (
                          <li key={idx}>{res}</li>
                        ))}
                      </ul>
                    </Descriptions.Item>
                  )}
                  {document.structuredData.evaluation && (
                    <Descriptions.Item label="Avaliação">
                      <Paragraph>{document.structuredData.evaluation}</Paragraph>
                    </Descriptions.Item>
                  )}
                  {document.structuredData.references && (
                    <Descriptions.Item label="Referências">
                      <Paragraph>{document.structuredData.references}</Paragraph>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}

            {/* Preview do Documento */}
            <Card>
              <Title level={4}>Preview do Documento Original</Title>
              <div style={{ width: '100%', height: 600, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                <iframe
                  src={documentService.previewOriginal(id)}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Document Preview"
                />
              </div>
            </Card>
          </Space>
        </div>
      </Content>
    </Layout>
  );
}
