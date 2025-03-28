export default interface TPauseData {
    id:number | null,
    name:string,
    value:string,
    actionHandler?:(props:any) => void
}