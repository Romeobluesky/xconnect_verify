import crypto from 'crypto';

async function getCPUId(): Promise<string> {
  // 실제 구현에서는 시스템 명령어나 네이티브 모듈을 사용해야 합니다
  return 'CPU-MOCK-ID';
}

async function getMotherboardId(): Promise<string> {
  return 'MB-MOCK-ID';
}

async function getDiskId(): Promise<string> {
  return 'DISK-MOCK-ID';
}

function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export async function getHardwareId(): Promise<string> {
  const cpuId = await getCPUId();
  const motherboardId = await getMotherboardId();
  const diskId = await getDiskId();

  return createHash([cpuId, motherboardId, diskId].join('|'));
}