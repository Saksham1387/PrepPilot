import { authOptions } from "@/lib/auth";
import { getAlldata, getCreditsInfo,} from "@/lib/fetch";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export async function Dashboard (){
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
    const user = await getAlldata(userId);
    const creditsinfo = await getCreditsInfo(userId);
    console.log(user)
    console.log(creditsinfo)
    return(
        <div>
            Dashboard Page
        </div>
    )
}