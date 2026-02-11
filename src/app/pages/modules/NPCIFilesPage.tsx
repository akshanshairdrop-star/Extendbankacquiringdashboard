import { useState } from 'react';
import { Upload, Download, RefreshCw, Eye, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '@/app/components/KPICard';
import { StatusBadge } from '@/app/components/StatusBadge';
import { DataTable, Column, RowAction } from '@/app/components/DataTable';
import { Modal } from '@/app/components/Modal';
import { ConfirmationModal } from '@/app/components/ConfirmationModal';
import { Drawer } from '@/app/components/Drawer';

interface NPCIFile {
  id: string;
  fileName: string;
  fileType: 'Settlement' | 'Chargeback' | 'Dispute';
  uploadDate: string;
  uploadedBy: string;
  status: 'validated' | 'pending' | 'failed' | 'exception';
  recordCount: number;
  hashStatus: 'valid' | 'invalid' | 'pending';
  fileSize: string;
}

const mockFiles: NPCIFile[] = [
  { id: '1', fileName: 'NPCI_SETTLEMENT_20260123.csv', fileType: 'Settlement', uploadDate: '2026-01-23 09:30', uploadedBy: 'John Doe', status: 'validated', recordCount: 15420, hashStatus: 'valid', fileSize: '2.4 MB' },
  { id: '2', fileName: 'NPCI_CHARGEBACK_20260123.csv', fileType: 'Chargeback', uploadDate: '2026-01-23 09:15', uploadedBy: 'Sarah Johnson', status: 'pending', recordCount: 245, hashStatus: 'pending', fileSize: '456 KB' },
  { id: '3', fileName: 'NPCI_SETTLEMENT_20260122.csv', fileType: 'Settlement', uploadDate: '2026-01-22 10:45', uploadedBy: 'Mike Williams', status: 'exception', recordCount: 14890, hashStatus: 'valid', fileSize: '2.2 MB' },
  { id: '4', fileName: 'NPCI_DISPUTE_20260122.csv', fileType: 'Dispute', uploadDate: '2026-01-22 09:00', uploadedBy: 'Emily Brown', status: 'failed', recordCount: 0, hashStatus: 'invalid', fileSize: '1.1 MB' },
];

export function NPCIFilesPage() {
  const [files, setFiles] = useState(mockFiles);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<NPCIFile | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'validate' | 'reprocess' | 'exception'; file: NPCIFile | null }>({ isOpen: false, type: 'validate', file: null });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Uploading NPCI file...',
        success: () => {
          setIsUploadModalOpen(false);
          setUploadFile(null);
          setIsLoading(false);
          return 'File uploaded successfully';
        },
        error: 'Upload failed',
      }
    );
  };

  const handleValidateHash = (file: NPCIFile) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Validating file hash...',
        success: () => {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, hashStatus: 'valid' as const, status: 'validated' as const } : f
          ));
          setConfirmModal({ isOpen: false, type: 'validate', file: null });
          setIsLoading(false);
          return 'Hash validated successfully';
        },
        error: 'Validation failed',
      }
    );
  };

  const handleReprocess = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Reprocessing file...',
        success: () => {
          setConfirmModal({ isOpen: false, type: 'reprocess', file: null });
          setIsLoading(false);
          return 'File queued for reprocessing';
        },
        error: 'Reprocess failed',
      }
    );
  };

  const handleMarkException = (reason?: string) => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Marking as exception...',
        success: () => {
          setFiles(prev => prev.map(f => 
            f.id === confirmModal.file?.id ? { ...f, status: 'exception' as const } : f
          ));
          setConfirmModal({ isOpen: false, type: 'exception', file: null });
          setIsLoading(false);
          return 'File marked as exception';
        },
        error: 'Failed to mark exception',
      }
    );
  };

  const handleDownload = (file: NPCIFile) => {
    toast.success(`Downloading ${file.fileName}`);
  };

  const columns: Column<NPCIFile>[] = [
    {
      key: 'fileName',
      label: 'File Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#4b1b91]" />
          <span className="font-medium text-[#1a1339]">{row.fileName}</span>
        </div>
      )
    },
    {
      key: 'fileType',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 bg-[#f5effb] text-[#4b1b91] rounded-md text-xs font-medium">
          {row.fileType}
        </span>
      )
    },
    {
      key: 'uploadDate',
      label: 'Upload Date',
      sortable: true,
      render: (row) => <span className="text-[#635c8a]">{row.uploadDate}</span>
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      render: (row) => <span className="text-[#1a1339]">{row.uploadedBy}</span>
    },
    {
      key: 'recordCount',
      label: 'Records',
      sortable: true,
      render: (row) => <span className="font-mono text-[#1a1339]">{row.recordCount.toLocaleString()}</span>
    },
    {
      key: 'hashStatus',
      label: 'Hash Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          row.hashStatus === 'valid' ? 'bg-[#eaf6f0] text-[#34b277]' :
          row.hashStatus === 'invalid' ? 'bg-[#f9ecec] text-[#d74242]' :
          'bg-[#fef3e8] text-[#f59f0a]'
        }`}>
          {row.hashStatus.toUpperCase()}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const statusMap = {
          validated: 'success',
          pending: 'pending',
          failed: 'failed',
          exception: 'failed'
        };
        return <StatusBadge status={statusMap[row.status] as any} label={row.status} />;
      }
    },
  ];

  const rowActions: RowAction<NPCIFile>[] = [
    {
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: (file) => {
        setSelectedFile(file);
        setIsViewDrawerOpen(true);
      },
    },
    {
      label: 'Download File',
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownload,
    },
    {
      label: 'Validate Hash',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (file) => handleValidateHash(file),
      show: (file) => file.hashStatus === 'pending',
    },
    {
      label: 'Re-run Validation',
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: (file) => setConfirmModal({ isOpen: true, type: 'reprocess', file }),
      show: (file) => file.status === 'failed',
    },
    {
      label: 'Mark Exception',
      icon: <AlertCircle className="w-4 h-4" />,
      onClick: (file) => setConfirmModal({ isOpen: true, type: 'exception', file }),
      variant: 'warning',
      show: (file) => file.status !== 'exception',
    },
  ];

  const validatedFiles = files.filter(f => f.status === 'validated').length;
  const pendingFiles = files.filter(f => f.status === 'pending').length;
  const exceptionFiles = files.filter(f => f.status === 'exception').length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1339]">NPCI File Management</h2>
          <p className="text-[#635c8a] text-sm mt-1">Upload and validate NPCI reconciliation files</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.info('Refreshing files...')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e2e9] text-[#1a1339] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload NPCI File
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Files" value={files.length.toString()} subtitle="Uploaded today" icon={FileText} />
        <KPICard title="Validated" value={validatedFiles.toString()} subtitle="Hash verified" icon={CheckCircle} />
        <KPICard title="Pending" value={pendingFiles.toString()} subtitle="Awaiting validation" icon={Clock} />
        <KPICard title="Exceptions" value={exceptionFiles.toString()} subtitle="Requires attention" icon={AlertCircle} />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={files}
        rowActions={rowActions}
        searchable
        searchPlaceholder="Search files..."
        rowKey={(row) => row.id}
      />

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload NPCI File" size="md">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">File Type *</label>
            <select className="w-full px-3 py-2 border border-[#e6e2e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c77efc]" required>
              <option value="">Select file type</option>
              <option value="settlement">Settlement</option>
              <option value="chargeback">Chargeback</option>
              <option value="dispute">Dispute</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1339] mb-2">Upload File *</label>
            <div className="border-2 border-dashed border-[#e6e2e9] rounded-lg p-6 text-center hover:border-[#c77efc] transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-[#c07bfc] mx-auto mb-2" />
                <p className="text-sm text-[#1a1339] font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-[#635c8a] mt-1">CSV or XLSX (MAX. 50MB)</p>
                {uploadFile && (
                  <p className="text-sm text-[#4b1b91] font-medium mt-2">{uploadFile.name}</p>
                )}
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={isLoading || !uploadFile} className="flex-1 px-6 py-3 bg-[#4b1b91] text-white rounded-lg hover:bg-[#3d1575] transition-colors font-medium disabled:opacity-50">
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            <button type="button" onClick={() => setIsUploadModalOpen(false)} className="flex-1 px-6 py-3 bg-[#f5effb] text-[#c07bfc] rounded-lg hover:bg-[#ede5f7] transition-colors font-medium">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* View File Drawer */}
      <Drawer isOpen={isViewDrawerOpen} onClose={() => setIsViewDrawerOpen(false)} title="File Details" size="lg">
        {selectedFile && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">File Name</label><p className="text-[#1a1339] font-medium">{selectedFile.fileName}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">File Type</label><p className="text-[#1a1339]">{selectedFile.fileType}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Upload Date</label><p className="text-[#1a1339]">{selectedFile.uploadDate}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Uploaded By</label><p className="text-[#1a1339]">{selectedFile.uploadedBy}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Record Count</label><p className="text-[#1a1339] font-bold text-lg">{selectedFile.recordCount.toLocaleString()}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">File Size</label><p className="text-[#1a1339] font-bold text-lg">{selectedFile.fileSize}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Hash Status</label><p className={`font-bold ${selectedFile.hashStatus === 'valid' ? 'text-[#34b277]' : selectedFile.hashStatus === 'invalid' ? 'text-[#d74242]' : 'text-[#f59f0a]'}`}>{selectedFile.hashStatus.toUpperCase()}</p></div>
              <div><label className="block text-sm font-medium text-[#635c8a] mb-1">Status</label><StatusBadge status={selectedFile.status as any} /></div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'validate', file: null })}
        onConfirm={confirmModal.type === 'reprocess' ? handleReprocess : handleMarkException}
        title={confirmModal.type === 'reprocess' ? 'Reprocess File' : 'Mark as Exception'}
        message={`Are you sure you want to ${confirmModal.type === 'reprocess' ? 'reprocess' : 'mark as exception'} this file?`}
        confirmText={confirmModal.type === 'reprocess' ? 'Reprocess' : 'Mark Exception'}
        variant={confirmModal.type === 'exception' ? 'warning' : 'info'}
        requireReason
        isLoading={isLoading}
      />
    </div>
  );
}