import { prePublish } from './pre-publish';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
  .command(prePublish)
  .demandCommand(1)
  .parse()
