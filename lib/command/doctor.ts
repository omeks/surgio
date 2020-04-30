// istanbul ignore file
import Command from 'common-bin';
import check from 'check-node-version';
import { promisify } from 'util';
import { join } from 'path';

import { errorHandler } from '../utils/error-helper';

class DoctorCommand extends Command {
  private options: object;

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = '使用方法: surgio doctor';
    this.options = {
      c: {
        alias: 'config',
        demandOption: false,
        describe: 'Surgio 配置文件',
        default: './surgio.conf.js',
        type: 'string',
      },
    };
  }

  public async run(ctx): Promise<void> {
    const doctorInfo = await DoctorCommand.generateDoctorInfo(ctx.cwd);

    doctorInfo.forEach(item => {
      console.log(item);
    });
  }

  public get description(): string {
    return '检查运行环境';
  }

  public errorHandler(err): void {
    errorHandler.call(this, err);
  }

  public static async generateDoctorInfo(cwd: string): Promise<ReadonlyArray<string>> {
    const doctorInfo: string[] = [];
    const pkg = require('../../package.json');
    const checkInfo: any = await promisify(check)();

    try {
      const gatewayPkg = require(join(cwd, 'node_modules/@surgio/gateway/package.json'));
      doctorInfo.push(`@surgio/gateway: ${gatewayPkg.version}`);
    } catch(_) {
      // no catch
    }

    doctorInfo.push(`surgio: ${pkg.version}`);

    Object.keys(checkInfo.versions).forEach(key => {
      if (key === 'node') {
        doctorInfo.push(`${key}: ${checkInfo.versions[key].version.version} (${process.execPath})`);
      } else {
        doctorInfo.push(`${key}: ${checkInfo.versions[key].version.version}`);
      }
    });

    return doctorInfo;
  }
}

export = DoctorCommand;
