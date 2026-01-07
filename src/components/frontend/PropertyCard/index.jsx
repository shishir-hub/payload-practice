import { Card, Text, Badge, Button, Group } from '@mantine/core';
import Link from 'next/link';

const PropertyCard = ({data}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{data.title}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {data.description}
      </Text>

      <Button component={Link} href={`/property/${data.id}`} color="blue" fullWidth mt="md" radius="md">
        Book 
      </Button>
    </Card>
  );
}

export default PropertyCard