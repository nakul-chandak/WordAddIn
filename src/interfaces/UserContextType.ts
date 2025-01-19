export interface UserContextType {
    isAuthenticated:boolean;
    subscriptionPlan:string;
    setAuthenticated:(token:string) => void;
    setSubscriptionPlan:() => void
 }
