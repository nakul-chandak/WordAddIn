export interface AppContextType {
    aiTypes:string[];
    isDrawerOpen:boolean;
    setAITypes:(_types:string[]) => void;
    drawerAction:(isOpen:boolean) => void;
    
}