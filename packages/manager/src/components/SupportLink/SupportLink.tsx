import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

/**
 * Types of entities that may be associated with a Support ticket.
 */
export type EntityType =
  | 'database_id'
  | 'domain_id'
  | 'firewall_id'
  | 'general'
  | 'linode_id'
  | 'lkecluster_id'
  | 'nodebalancer_id'
  | 'none'
  | 'volume_id';

/**
 * Describes an entity associated with a Support ticket using its ID and type.
 */
export interface EntityForTicketDetails {
  id: number;
  type: EntityType;
}

/**
 * Types of Support tickets.
 */
export type TicketType = 'general' | 'smtp';

interface SupportLinkProps {
  description?: string;
  entity?: EntityForTicketDetails;
  onClick?: LinkProps['onClick'];
  text: string;
  ticketType?: TicketType;
  title?: string;
}

const SupportLink = (props: SupportLinkProps) => {
  const { description, entity, onClick, text, ticketType, title } = props;
  return (
    <Link
      to={{
        pathname: '/support/tickets',
        state: {
          description,
          entity,
          open: true,
          ticketType,
          title,
        },
      }}
      onClick={onClick}
    >
      {text}
    </Link>
  );
};

export { SupportLink };
