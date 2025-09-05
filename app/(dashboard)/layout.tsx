
import { Header } from "@/components/header";

type Props = {
    children : React.ReactNode;

};

const DashboardLayout = ({ children }: Props) => {//one rule of layout.tsx is that it needs to render the children
    return ( 
        <>
            <Header />
            <main className="px-3 lg:px-14">
                {children}
            </main>
        </>
    );
};
export default DashboardLayout;