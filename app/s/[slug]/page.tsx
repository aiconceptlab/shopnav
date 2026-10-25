import Customer from '../../../components/Customer';export default async function Page({params}:{params:Promise<{slug:string}>}){return <Customer slug={(await params).slug}/>}
