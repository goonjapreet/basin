import jupyterUtils from '@/core/jupyterUtils.ts'
import blockTypes from '@/blocks/blockTypes.ts'
import BlocksContainer from '@/components/BlocksContainer.vue'
import BlockProperties from '@/components/BlockProperties.vue'
import EditorBlocksBar from './EditorBlocksBar.vue'
import DataFrameViewer from '@/components/dataFrameViewer/DataFrameViewer.vue'
import jobRenderer from '@/core/jobRenderer'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Kernel } from "@jupyterlab/services"
import Block from '@/models/Block';
import Job from '@/models/Job';
@Component({
  name: 'Editor',
  components: {
    BlocksContainer,
    BlockProperties,
    EditorBlocksBar,
    DataFrameViewer
  },
})
export default class Editor extends Vue {
  // explicitly define refs so we can type them in typescript
  // $refs!: Vue['$refs'] & {
  //   propertiesPanel: BlockProperties
  // };
  // data
  kernel:Kernel.IKernelConnection = null
  dragAdding = false
  props = {}
  interrupt = false // special flag to allow to interrupt a running job mid way
  blockTypes = blockTypes
  showPropertiesPanel = false
  job:Job = null // holds the job content
  jobCommands:Array<Block> = null // holds the runtime commands of the job while debugging
  selectedBlock:object = null
  selectedBlockProperties = {} // we store this separately because of reactivity issues with vue and the v-bind to the properties panel
  running = false
  readOnly = false
  inspectDataframeVariable = ''
  showDataframePanel = false
  error:string = null
  showError = false

  async showProperties(block:Block) {
    this.selectedBlock=block
    this.selectedBlockProperties=block.properties
    this.showPropertiesPanel = true        
    await this.$nextTick();
    // this.$refs.propertiesPanel.reset()
  }
  selectBlock (block:Block) {
    this.selectedBlock = block
    this.selectedBlockProperties = block.properties
  }
  deselectBlock (block:Block) {
    this.selectedBlock = null
  }
  saveProperties() {
    // find index of selected block in job contents
    // (<BlocksContainer>this.$refs["container"]).setProperties(this.selectedBlock.id,this.$refs["propertiesPanel"].getProperties())
    // this.showPropertiesPanel = false
  }
  getContainer() {
    // returns the handle to the blocks container
    return this.$refs["container"]
  }
    async run() {
      //
      // run this job in jupyter notebook
      //
      this.running = true
      this.interrupt = false
      this.readOnly = true
//       let commands = jobRenderer.render(this.job)
//       this.jobCommands = commands
//       // clear running or completed state of all blocks
//       for (let block of this.job.blocks) {
//         this.getContainer().getBlock(block.id).setState('')
//       }
//       console.log("running")
//       console.log(commands)
//       let initCode = `
// from pyspark.sql import SparkSession
// spark = SparkSession \
//   .builder \
//   .appName("superglue studio") \
//   .config("spark.sql.decimalOperations.allowPrecisionLoss",False) \
//   .getOrCreate()
// `
//       await jupyterUtils.sendToPython(this.kernel,initCode)

//       for (let command of commands) {
//         // check if we have a flag to inerrupt current execution
//         if (this.interrupt) {
//           this.interrupt = false
//           console.log("interrupting execution")
//           break
//         }
//         console.log("running command")
//         console.log(command.code)
//         this.$refs["container"].getBlock(command.blockId).setState('running')
//         try {
//               let response = await jupyterUtils.sendToPython(this.kernel,command.code)
//               console.log(response)
//         }
//         catch (e) {
//             console.log(e)
//             if (e.ename) {
//                 this.error = `${e.ename}: ${e.evalue}`
//                 this.showError = true
//             }
//             return
//         }

//         this.$refs["container"].getBlock(command.blockId).setState('completed')
      // }
    }
    stop() {
      // stop running the job. exit 'debug' mode
      this.interrupt = true
      this.running = false
      this.readOnly = false
      // for (let block of this.job.blocks) {
      //   this.getContainer().getBlock(block.id).setState('')
      // }
    }
    // async inspectSocket(socket:object) {
    //   console.log("inspecting socket")
    //   console.log(socket)
    //   // decypher the python variable name from the runtime commands
    //   let command = this.jobCommands.find( (command:object) => command.blockId==socket.id)
    //   console.log(`inspect ${command.inputs[socket.index]}`)
    //   let dataframe = command.inputs[socket.index]

    //   this.showDataframePanel = true
    //   this.inspectDataframeVariable = dataframe
    // }
    get status () {
      return this.$store.state.job.status
    }
    get storeBlocks() {
      return this.$store.state.job.blocks
    }
    @Watch('job', { immediate: true})
    onJobChanged(newVal:string, oldVal:string) {
      if (newVal) localStorage.job = JSON.stringify(newVal)
    }
    async created() {
      this.interrupt = true
      await this.$store.dispatch("job/initialize")
        try {
            if (localStorage.job) {
              this.job = JSON.parse(localStorage.job)
            }
          }

          catch (e) {
            console.log(e)
          }
          this.kernel = await jupyterUtils.getKernel()    
    }
    async mounted () {
      // cleanup active kernel
      window.addEventListener('beforeunload', () => {
          console.log("shutting down kernel")
          this.kernel.shutdown()
      }, false)
    }
    beforeDestroy() {
      console.log("shutting down kernel")
      this.kernel.shutdown()
    }
  }
