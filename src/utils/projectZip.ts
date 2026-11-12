import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../data/javaProjectFiles';

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('TrueTag_FakeProductDetectionSystem');

  if (!rootFolder) return;

  // Add all project files
  JAVA_PROJECT_FILES.forEach(file => {
    rootFolder.file(file.path, file.content);
  });

  // Generate ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'TrueTag_FakeProductDetection_JavaTomcat.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
