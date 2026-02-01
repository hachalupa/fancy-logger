import { Button } from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPenToSquare, 
  faTrash, 
  faTimes,
  faPlus,
  faSave,
  faAngleLeft,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';

export function ButtonEdit({ children = 'Edit', onClick, size = 'sm', ...props }) {
  return (
    <Button 
      variant="secondary" 
      size={size}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={faPenToSquare} className="icon-left" />
      {children}
    </Button>
  );
}

export function ButtonDelete({ children = 'Delete', onClick, size = 'sm', ...props }) {
  return (
    <Button 
      variant="ghost" 
      size={size}
      onClick={onClick}
      className="btn-danger"
      {...props}
    >
      <FontAwesomeIcon icon={faTrash} className="icon-left" />
      {children}
    </Button>
  );
}

export function ButtonSave({ children = 'Save', onClick, size = 'base', ...props }) {
  return (
    <Button 
      variant="primary" 
      size={size}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={faSave} className="icon-left" />
      {children}
    </Button>
  );
}

export function ButtonCancel({ children = 'Cancel', onClick, size = 'sm', ...props }) {
  return (
    <Button 
      variant="ghost" 
      size={size}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={faTimes} className="icon-left" />
      {children}
    </Button>
  );
}

export function ButtonAdd({ children = 'Add', onClick, size = 'base', ...props }) {
  return (
    <Button 
      variant="primary" 
      size={size}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={faPlus} className="icon-left" />
      {children}
    </Button>
  );
}

export function ButtonBack({ children = 'Back', onClick, size = 'base', ...props }) {
  return (
    <Button
      variant='primary'
      size={size}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={faAngleLeft} className='icon-left' />
      {children}
    </Button>
  );
}
export function ButtonTask({ children = 'Task', onClick, size = 'base', ...props }) {
  return (
    <Button
      variant='primary'
      size={size}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={faListCheck} className='icon-left' />
      {children}
    </Button>
  );
}     