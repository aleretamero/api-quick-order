import { Device } from '@prisma/client';

type DevicePresenterProps = Device;

export class DevicePresenter {
  id: string;

  constructor(props: DevicePresenterProps) {
    this.id = props.id;
  }
}
