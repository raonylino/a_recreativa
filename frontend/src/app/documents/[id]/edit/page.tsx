'use client';

import { Document, documentService, StructuredData } from '@/services/api';
import { ArrowLeftOutlined, FilePdfOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, Layout, message, Row, Space, Spin, Typography } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

export default function EditDocument() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form] = Form.useForm();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentService.getById(id);
      setDocument(data);

      // Preencher formulário se já houver dados estruturados
      if (data.structuredData) {
        form.setFieldsValue(data.structuredData);
      }
    } catch (error) {
      message.error('Erro ao carregar documento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: StructuredData) => {
    try {
      setSaving(true);
      await documentService.saveStructuredData(id, values);
      message.success('Dados salvos com sucesso!');
      loadDocument(); // Recarregar para atualizar status
    } catch (error) {
      message.error('Erro ao salvar dados');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      await documentService.generateStandardized(id);
      message.success('PDF padronizado gerado com sucesso!');
      loadDocument();

      // Redirecionar para visualização após 1 segundo
      setTimeout(() => {
        router.push(`/documents/${id}`);
      }, 1000);
    } catch (error) {
      message.error('Erro ao gerar PDF padronizado');
      console.error(error);
    } finally {
      setGenerating(false);
    }
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
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/documents/${id}`)}>
            Voltar
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            Estruturar Plano de Aula: {document.originalFileName}
          </Title>
        </Space>
      </Header>

      <Content style={{ padding: 24, background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Row gutter={24}>
            {/* Formulário */}
            <Col xs={24} lg={14}>
              <Card>
                <Title level={5}>Dados do Plano de Aula</Title>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  initialValues={{
                    objectives: [''],
                    content: [''],
                    resources: ['']
                  }}
                >
                  {/* Informações Básicas */}
                  <Form.Item
                    label="Título do Plano de Aula"
                    name="title"
                    rules={[{ required: true, message: 'Por favor, insira o título' }]}
                  >
                    <Input placeholder="Ex: Introdução à Fotossíntese" size="large" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Disciplina"
                        name="subject"
                        rules={[{ required: true, message: 'Insira a disciplina' }]}
                      >
                        <Input placeholder="Ex: Ciências" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Série/Ano"
                        name="grade"
                        rules={[{ required: true, message: 'Insira a série' }]}
                      >
                        <Input placeholder="Ex: 7º Ano" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Duração da Aula"
                    name="duration"
                    rules={[{ required: true, message: 'Insira a duração' }]}
                  >
                    <Input placeholder="Ex: 2 aulas de 50 minutos" />
                  </Form.Item>

                  <Divider />

                  {/* Objetivos */}
                  <Title level={5}>Objetivos</Title>
                  <Form.List name="objectives">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...field}
                              style={{ flex: 1, marginBottom: 0 }}
                              rules={[{ required: true, message: 'Objetivo não pode estar vazio' }]}
                            >
                              <Input placeholder={`Objetivo ${index + 1}`} />
                            </Form.Item>
                            {fields.length > 1 && (
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            )}
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Adicionar Objetivo
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Divider />

                  {/* Conteúdo */}
                  <Title level={5}>Conteúdo Programático</Title>
                  <Form.List name="content">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...field}
                              style={{ flex: 1, marginBottom: 0 }}
                              rules={[{ required: true, message: 'Conteúdo não pode estar vazio' }]}
                            >
                              <Input placeholder={`Conteúdo ${index + 1}`} />
                            </Form.Item>
                            {fields.length > 1 && (
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            )}
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Adicionar Conteúdo
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Divider />

                  {/* Metodologia */}
                  <Form.Item
                    label="Metodologia"
                    name="methodology"
                    rules={[{ required: true, message: 'Descreva a metodologia' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Descreva como a aula será conduzida, estratégias e técnicas..."
                    />
                  </Form.Item>

                  {/* Recursos */}
                  <Title level={5}>Recursos Didáticos</Title>
                  <Form.List name="resources">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...field}
                              style={{ flex: 1, marginBottom: 0 }}
                              rules={[{ required: true, message: 'Recurso não pode estar vazio' }]}
                            >
                              <Input placeholder={`Recurso ${index + 1}`} />
                            </Form.Item>
                            {fields.length > 1 && (
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            )}
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Adicionar Recurso
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Divider />

                  {/* Avaliação */}
                  <Form.Item
                    label="Avaliação"
                    name="evaluation"
                    rules={[{ required: true, message: 'Descreva a avaliação' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Como os alunos serão avaliados? Critérios, instrumentos..."
                    />
                  </Form.Item>

                  {/* Referências */}
                  <Form.Item
                    label="Referências Bibliográficas (Opcional)"
                    name="references"
                  >
                    <TextArea
                      rows={3}
                      placeholder="Liste as referências utilizadas..."
                    />
                  </Form.Item>

                  <Divider />

                  {/* Botões de Ação */}
                  <Space size="middle">
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      size="large"
                      loading={saving}
                    >
                      Salvar Dados
                    </Button>

                    {document.structuredData && (
                      <Button
                        type="default"
                        icon={<FilePdfOutlined />}
                        size="large"
                        loading={generating}
                        onClick={handleGeneratePDF}
                        style={{ background: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
                      >
                        Gerar PDF Padronizado
                      </Button>
                    )}
                  </Space>
                </Form>
              </Card>
            </Col>

            {/* Preview do Documento Original */}
            <Col xs={24} lg={10}>
              <Card title="Documento Original" style={{ position: 'sticky', top: 24 }}>
                <div style={{ width: '100%', height: 800, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                  <iframe
                    src={documentService.previewOriginal(id)}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Document Preview"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
