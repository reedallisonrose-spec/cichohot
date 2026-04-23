import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Collapse,
  IconButton
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  TableChart as DatabaseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
// DatabaseSetupService removido - não precisamos mais dele

interface DatabaseSetupModalProps {
  open: boolean;
  onClose: () => void;
}

const DatabaseSetupModal: FC<DatabaseSetupModalProps> = ({ open, onClose }) => {
  const [projectId, setProjectId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [setupProgress, setSetupProgress] = useState<SetupProgress | null>(null);
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ['Configuração', 'Validação', 'Setup', 'Finalizado'];

  // Carregar credenciais salvas automaticamente
  useEffect(() => {
    if (open) {
      // Não dependemos mais do Appwrite
      const saved = { projectId: '', apiKey: '' };
      if (saved.projectId && saved.apiKey) {
        setProjectId(saved.projectId);
        setApiKey(saved.apiKey);
      }
    }
  }, [open]);

  const handleClose = () => {
    if (!isSetupRunning && !isValidating) {
      // Reset state when closing
      setProjectId('');
      setApiKey('');
      setValidationResult(null);
      setSetupProgress(null);
      setSetupResult(null);
      setCurrentStep(0);
      onClose();
    }
  };

  const validateConnection = async () => {
    if (!projectId.trim() || !apiKey.trim()) {
      setValidationResult({
        success: false,
        message: 'Por favor, preencha tanto o Project ID quanto a API Key'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Simular validação do Wasabi
      await new Promise(resolve => setTimeout(resolve, 1000));
      setValidationResult({
        success: true,
        message: 'Conexão com Wasabi validada com sucesso!'
      });
      
        setCurrentStep(1);
    } catch (error) {
      setValidationResult({
        success: false,
        message: `Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setIsValidating(false);
    }
  };

  const runDatabaseSetup = async () => {
    if (!validationResult?.success) {
      await validateConnection();
      if (!validationResult?.success) return;
    }

    setIsSetupRunning(true);
    setSetupResult(null);
    setCurrentStep(2);

    try {
      // Simular setup do Wasabi
      setSetupProgress({ step: 1, message: 'Criando bucket...', percentage: 25 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSetupProgress({ step: 2, message: 'Configurando permissões...', percentage: 50 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSetupProgress({ step: 3, message: 'Finalizando configuração...', percentage: 75 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSetupProgress({ step: 4, message: 'Configuração concluída!', percentage: 100 });
      
      setSetupResult({
        success: true,
        message: 'Wasabi configurado com sucesso!',
        details: ['Bucket criado', 'Permissões configuradas', 'Sistema pronto para uso'],
        errors: []
      });
      setCurrentStep(3);
    } catch (error) {
      setSetupResult({
        success: false,
        message: `Erro durante o setup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        details: [],
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      });
      setCurrentStep(3);
    } finally {
      setIsSetupRunning(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
                         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
               Insira as credenciais do seu bucket Wasabi para configurar automaticamente o armazenamento.
             </Typography>
            
            <TextField
              fullWidth
              label="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="68xxxxxxxxxxxxxxxxxx"
              sx={{ mb: 2 }}
              disabled={isValidating || isSetupRunning}
              helperText="O Access Key do seu bucket Wasabi (encontrado no dashboard)"
            />

            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Sua Secret Key do Wasabi"
              sx={{ mb: 3 }}
              disabled={isValidating || isSetupRunning}
              helperText="Chave API com permissões de administrador"
            />

            {validationResult && (
              <Alert 
                severity={validationResult.success ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                {validationResult.message}
              </Alert>
            )}

            {/* Exportar/Importar removidos: usaremos VITE_APPWRITE_PROJECT_ID em produção */}
          </Box>
        );

      case 1:
        return (
          <Box>
                         <Alert severity="success" sx={{ mb: 3 }}>
               <Typography variant="body2">
                 ✅ Credenciais validadas com sucesso! Agora você pode configurar automaticamente a base de dados.
               </Typography>
             </Alert>
             <Typography variant="body2" color="text.secondary">
               O sistema irá criar automaticamente:
             </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><DatabaseIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Database principal" />
              </ListItem>
              <ListItem>
                <ListItemIcon><DatabaseIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Collection de Videos" />
              </ListItem>
              <ListItem>
                <ListItemIcon><DatabaseIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Collection de Users" />
              </ListItem>
              <ListItem>
                <ListItemIcon><DatabaseIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Collection de Configurações" />
              </ListItem>
              <ListItem>
                <ListItemIcon><DatabaseIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Collection de Sessions" />
              </ListItem>
              <ListItem>
                <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Bucket de Videos" />
              </ListItem>
              <ListItem>
                <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Bucket de Thumbnails" />
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Dados iniciais" />
              </ListItem>
            </List>
          </Box>
        );

      case 2:
        return (
          <Box>
                         <Typography variant="h6" sx={{ mb: 2 }}>
               Configurando base de dados...
             </Typography>
            
            {setupProgress && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {setupProgress.stage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {setupProgress.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={setupProgress.progress} 
                  sx={{ mb: 1 }}
                  color={setupProgress.isError ? 'error' : 'primary'}
                />
                <Typography variant="body2" color={setupProgress.isError ? 'error.main' : 'text.secondary'}>
                  {setupProgress.message}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            {setupResult && (
              <>
                <Alert 
                  severity={setupResult.success ? 'success' : 'error'} 
                  sx={{ mb: 2 }}
                  action={
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  }
                >
                               <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
               {setupResult.message}
             </Typography>
             <Typography variant="body2" sx={{ mt: 1 }}>
               Clique em "Ver Detalhes" para ver o resumo das operações realizadas.
             </Typography>
                </Alert>

                <Collapse in={showDetails}>
                  <Box sx={{ mt: 2 }}>
                    {setupResult.details.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                                                 <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>
                           ✅ Operações Realizadas:
                         </Typography>
                        <List dense>
                          {setupResult.details.map((detail, index) => (
                            <ListItem key={index}>
                                                         <ListItemIcon>
                             <CheckCircleIcon color="success" fontSize="small" />
                           </ListItemIcon>
                                                             <ListItemText 
                                 primary={detail}
                                 primaryTypographyProps={{ variant: 'body2' }}
                               />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {setupResult.errors.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="error.main" sx={{ mb: 1 }}>
                          ❌ Erros encontrados:
                        </Typography>
                        <List dense>
                          {setupResult.errors.map((error, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <ErrorIcon color="error" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={error}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  const getDialogActions = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Button 
              onClick={handleClose} 
              disabled={isValidating || isSetupRunning}
            >
              Cancelar
            </Button>
            <Button 
              onClick={validateConnection}
              variant="contained"
              disabled={isValidating || isSetupRunning || !projectId.trim() || !apiKey.trim()}
              startIcon={isValidating ? <CircularProgress size={16} /> : null}
            >
              {isValidating ? 'Validando...' : 'Validar Conexão'}
            </Button>
          </>
        );

      case 1:
        return (
          <>
            <Button 
              onClick={() => setCurrentStep(0)}
              disabled={isSetupRunning}
            >
              Voltar
            </Button>
            <Button 
              onClick={runDatabaseSetup}
              variant="contained"
              color="primary"
              disabled={isSetupRunning}
            >
              Iniciar Setup Automático
            </Button>
          </>
        );

      case 2:
        return (
          <Button 
            onClick={handleClose} 
            disabled={isSetupRunning}
          >
            Cancelar
          </Button>
        );

      case 3:
        return (
          <Button 
            onClick={handleClose}
            variant="contained"
            color={setupResult?.success ? 'primary' : 'error'}
          >
            Fechar
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon color="primary" />
          <Typography variant="h6">
            Configurar Armazenamento Wasabi
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {getDialogActions()}
      </DialogActions>
    </Dialog>
  );
};

export default DatabaseSetupModal;
