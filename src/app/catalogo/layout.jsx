import AuthChecker from '../../Components/AuthChecker';

export default function CatalogoLayout({ children }) {
    // Los roles que pueden acceder a esta ruta
    const rolesPermitidos = ['user', 'admin']; 

    return (
        <AuthChecker allowedRoles={rolesPermitidos}>
            {children}
        </AuthChecker>
    );
}